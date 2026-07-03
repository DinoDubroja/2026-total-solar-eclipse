import { useEffect, useRef, useState } from 'react'
import { getGoogleMapsApiKey, loadGoogleMaps3d } from './maps/googleMaps3d'

interface GoogleMaps3dViewProps {
  latitude: number
  longitude: number
}

type MapStatus = 'not-configured' | 'loading' | 'ready' | 'error'

const DEFAULT_CAMERA = {
  heading: 235,
  range: 1800,
  tilt: 68,
}

function formatCenter(latitude: number, longitude: number) {
  return `${latitude.toFixed(6)},${longitude.toFixed(6)},650`
}

function clampNumber(value: number, min: number, max: number) {
  if (Number.isNaN(value)) {
    return min
  }

  return Math.min(Math.max(value, min), max)
}

export function GoogleMaps3dView({ latitude, longitude }: GoogleMaps3dViewProps) {
  const apiKey = getGoogleMapsApiKey()
  const hostRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLElement | null>(null)
  const [status, setStatus] = useState<MapStatus>(apiKey ? 'loading' : 'not-configured')
  const [heading, setHeading] = useState(DEFAULT_CAMERA.heading)
  const [range, setRange] = useState(DEFAULT_CAMERA.range)
  const [tilt, setTilt] = useState(DEFAULT_CAMERA.tilt)

  useEffect(() => {
    if (!apiKey) {
      setStatus('not-configured')
      return
    }

    let cancelled = false

    setStatus('loading')
    loadGoogleMaps3d(apiKey)
      .then(() => {
        if (!cancelled) {
          setStatus('ready')
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus('error')
        }
      })

    return () => {
      cancelled = true
    }
  }, [apiKey])

  useEffect(() => {
    const host = hostRef.current

    if (!host || status !== 'ready') {
      return
    }

    if (!mapRef.current) {
      const mapElement = document.createElement('gmp-map-3d')
      mapElement.setAttribute('mode', 'hybrid')
      mapElement.setAttribute('aria-label', 'Google photorealistic 3D observer map')
      mapRef.current = mapElement
      host.replaceChildren(mapElement)
    }

    mapRef.current.setAttribute('center', formatCenter(latitude, longitude))
    mapRef.current.setAttribute('heading', heading.toString())
    mapRef.current.setAttribute('range', range.toString())
    mapRef.current.setAttribute('tilt', tilt.toString())
  }, [heading, latitude, longitude, range, status, tilt])

  function resetCamera() {
    setHeading(DEFAULT_CAMERA.heading)
    setRange(DEFAULT_CAMERA.range)
    setTilt(DEFAULT_CAMERA.tilt)
  }

  return (
    <div className="google-map-shell">
      <div className="google-map-canvas" ref={hostRef}>
        {status === 'not-configured' && (
          <div className="google-map-placeholder">
            <strong>Google 3D map not configured</strong>
            <span>VITE_GOOGLE_MAPS_API_KEY is missing</span>
          </div>
        )}
        {status === 'loading' && (
          <div className="google-map-placeholder">
            <strong>Loading Google 3D map</strong>
            <span>{latitude.toFixed(4)}, {longitude.toFixed(4)}</span>
          </div>
        )}
        {status === 'error' && (
          <div className="google-map-placeholder">
            <strong>Google 3D map failed to load</strong>
            <span>Using local planning overlay below</span>
          </div>
        )}
      </div>

      <div className="map-camera-controls" aria-label="3D map camera controls">
        <div className="map-camera-control">
          <span>Heading {heading} deg</span>
          <div className="map-camera-control-row">
            <input
              aria-label="Heading degrees slider"
              type="range"
              min="0"
              max="359"
              value={heading}
              onChange={(event) => setHeading(clampNumber(event.target.valueAsNumber, 0, 359))}
            />
            <input
              aria-label="Heading degrees"
              type="number"
              min="0"
              max="359"
              value={heading}
              onChange={(event) => setHeading(clampNumber(event.target.valueAsNumber, 0, 359))}
            />
          </div>
        </div>
        <div className="map-camera-control">
          <span>Tilt {tilt} deg</span>
          <div className="map-camera-control-row">
            <input
              aria-label="Tilt degrees slider"
              type="range"
              min="0"
              max="80"
              value={tilt}
              onChange={(event) => setTilt(clampNumber(event.target.valueAsNumber, 0, 80))}
            />
            <input
              aria-label="Tilt degrees"
              type="number"
              min="0"
              max="80"
              value={tilt}
              onChange={(event) => setTilt(clampNumber(event.target.valueAsNumber, 0, 80))}
            />
          </div>
        </div>
        <div className="map-camera-control">
          <span>Range {range} m</span>
          <div className="map-camera-control-row">
            <input
              aria-label="Range meters slider"
              type="range"
              min="350"
              max="6000"
              step="50"
              value={range}
              onChange={(event) => setRange(clampNumber(event.target.valueAsNumber, 350, 6000))}
            />
            <input
              aria-label="Range meters"
              type="number"
              min="350"
              max="6000"
              step="50"
              value={range}
              onChange={(event) => setRange(clampNumber(event.target.valueAsNumber, 350, 6000))}
            />
          </div>
        </div>
        <button type="button" className="map-camera-reset" onClick={resetCamera}>
          Reset view
        </button>
      </div>
    </div>
  )
}
