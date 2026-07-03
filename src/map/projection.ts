export const MAP_VIEWBOX_WIDTH = 360
export const MAP_VIEWBOX_HEIGHT = 180

export interface MapPoint {
  x: number
  y: number
}

export interface GeoPoint {
  latitude: number
  longitude: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function coordinatesToMapPoint(point: GeoPoint): MapPoint {
  return {
    x: clamp(point.longitude, -180, 180) + 180,
    y: 90 - clamp(point.latitude, -90, 90),
  }
}

export function mapPointToCoordinates(point: MapPoint): GeoPoint {
  return {
    latitude: 90 - clamp(point.y, 0, MAP_VIEWBOX_HEIGHT),
    longitude: clamp(point.x, 0, MAP_VIEWBOX_WIDTH) - 180,
  }
}

export function coordinatesToSvgPolyline(points: readonly GeoPoint[]) {
  return points
    .map((point) => {
      const mapPoint = coordinatesToMapPoint(point)
      return `${mapPoint.x.toFixed(2)},${mapPoint.y.toFixed(2)}`
    })
    .join(' ')
}