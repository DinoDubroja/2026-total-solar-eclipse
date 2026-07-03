import { useEffect, useRef, useState } from 'react'
import { getGoogleMapsApiKey, loadGoogleMaps3d } from './maps/googleMaps3d'

interface GoogleMaps3dViewProps {
  latitude: number
  longitude: number
}

type MapStatus = 'not-configured' | 'loading' | 'ready' | 'error'

function formatCenter(latitude: number, longitude: number) {
  return `${latitude.toFixed(6)},${longitude.toFixed(6)},650`
}

export function GoogleMaps3dView({ latitude, longitude }: GoogleMaps3dViewProps) {
  const apiKey = getGoogleMapsApiKey()
  const hostRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLElement | null>(null)
  const [status, setStatus] = useState<MapStatus>(apiKey ? 'loading' : 'not-configured')

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
      mapElement.setAttribute('tilt', '68')
      mapElement.setAttribute('range', '1800')
      mapElement.setAttribute('heading', '235')
      mapElement.setAttribute('mode', 'hybrid')
      mapElement.setAttribute('aria-label', 'Google photorealistic 3D observer map')
      mapRef.current = mapElement
      host.replaceChildren(mapElement)
    }

    mapRef.current.setAttribute('center', formatCenter(latitude, longitude))
  }, [latitude, longitude, status])

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
    </div>
  )
}
