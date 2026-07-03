import { type PointerEvent } from 'react'
import {
  partialVisibilityPolygon,
  referenceCities,
  totalityCenterline,
} from './map/eclipsePath'
import {
  MAP_VIEWBOX_HEIGHT,
  MAP_VIEWBOX_WIDTH,
  coordinatesToMapPoint,
  coordinatesToSvgPolyline,
  mapPointToCoordinates,
  type GeoPoint,
} from './map/projection'

interface EclipseMapProps {
  latitude: number
  longitude: number
  onSelectCoordinates: (coordinates: GeoPoint) => void
}

const worldRegions = [
  'M40,42 C56,24 86,22 104,36 C116,50 102,65 87,70 C70,78 50,70 38,58 Z',
  'M82,78 C101,83 110,102 101,121 C91,143 75,151 65,135 C57,119 67,99 76,86 Z',
  'M140,37 C161,27 188,31 204,48 C219,64 209,82 188,85 C166,89 139,74 130,57 Z',
  'M183,80 C205,78 220,92 220,113 C219,137 199,150 181,139 C166,130 163,105 174,90 Z',
  'M229,62 C255,47 295,52 320,75 C342,96 335,126 303,129 C272,131 237,111 222,88 Z',
  'M286,134 C305,128 326,138 330,154 C314,163 288,161 278,149 Z',
]

export function EclipseMap({ latitude, longitude, onSelectCoordinates }: EclipseMapProps) {
  const selectedPoint = coordinatesToMapPoint({ latitude, longitude })
  const totalityPoints = coordinatesToSvgPolyline(totalityCenterline)
  const partialPoints = coordinatesToSvgPolyline(partialVisibilityPolygon)

  function handlePointerDown(event: PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * MAP_VIEWBOX_WIDTH
    const y = ((event.clientY - rect.top) / rect.height) * MAP_VIEWBOX_HEIGHT

    onSelectCoordinates(mapPointToCoordinates({ x, y }))
  }

  return (
    <section className="map-panel" aria-label="Eclipse map">
      <div className="map-header">
        <div>
          <h2>Eclipse Map</h2>
          <p>Approximate 2026 visibility overlay</p>
        </div>
        <div className="map-coordinate-readout">
          <span>Selected</span>
          <strong>
            {latitude.toFixed(3)}, {longitude.toFixed(3)}
          </strong>
        </div>
      </div>

      <svg
        className="world-map"
        viewBox={`0 0 ${MAP_VIEWBOX_WIDTH} ${MAP_VIEWBOX_HEIGHT}`}
        role="img"
        aria-label="Approximate eclipse visibility map"
        onPointerDown={handlePointerDown}
      >
        <rect className="map-ocean" width={MAP_VIEWBOX_WIDTH} height={MAP_VIEWBOX_HEIGHT} />
        {[-120, -60, 0, 60, 120].map((longitudeLine) => (
          <line
            className="map-grid"
            key={`lon-${longitudeLine}`}
            x1={longitudeLine + 180}
            x2={longitudeLine + 180}
            y1="0"
            y2={MAP_VIEWBOX_HEIGHT}
          />
        ))}
        {[-60, -30, 0, 30, 60].map((latitudeLine) => (
          <line
            className="map-grid"
            key={`lat-${latitudeLine}`}
            x1="0"
            x2={MAP_VIEWBOX_WIDTH}
            y1={90 - latitudeLine}
            y2={90 - latitudeLine}
          />
        ))}
        {worldRegions.map((path) => (
          <path className="map-land" d={path} key={path} />
        ))}
        <polygon className="partial-zone" points={partialPoints} />
        <polyline className="totality-band" points={totalityPoints} />
        <polyline className="central-line" points={totalityPoints} />
        {referenceCities.map((city) => {
          const point = coordinatesToMapPoint(city)
          return (
            <g className="map-city" key={city.id}>
              <circle cx={point.x} cy={point.y} r="1.7" />
              <text x={point.x + 3} y={point.y - 2}>
                {city.label}
              </text>
            </g>
          )
        })}
        <g className="selected-map-point">
          <circle cx={selectedPoint.x} cy={selectedPoint.y} r="5.5" />
          <circle cx={selectedPoint.x} cy={selectedPoint.y} r="2" />
        </g>
      </svg>

      <div className="map-legend" aria-label="Map legend">
        <span className="legend-totality">Totality path</span>
        <span className="legend-partial">Partial visibility</span>
        <span className="legend-selected">Observer</span>
      </div>
    </section>
  )
}