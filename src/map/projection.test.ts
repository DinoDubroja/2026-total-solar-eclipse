import { describe, expect, it } from 'vitest'
import {
  MAP_VIEWBOX_HEIGHT,
  MAP_VIEWBOX_WIDTH,
  coordinatesToMapPoint,
  coordinatesToSvgPolyline,
  mapPointToCoordinates,
} from './projection'

describe('map projection helpers', () => {
  it('maps lon/lat to an equirectangular SVG viewBox', () => {
    expect(coordinatesToMapPoint({ latitude: 90, longitude: -180 })).toEqual({ x: 0, y: 0 })
    expect(coordinatesToMapPoint({ latitude: 0, longitude: 0 })).toEqual({ x: 180, y: 90 })
    expect(coordinatesToMapPoint({ latitude: -90, longitude: 180 })).toEqual({
      x: MAP_VIEWBOX_WIDTH,
      y: MAP_VIEWBOX_HEIGHT,
    })
  })

  it('maps equirectangular SVG viewBox points back to lon/lat', () => {
    expect(mapPointToCoordinates({ x: 0, y: 0 })).toEqual({ latitude: 90, longitude: -180 })
    expect(mapPointToCoordinates({ x: 180, y: 90 })).toEqual({ latitude: 0, longitude: 0 })
    expect(mapPointToCoordinates({ x: MAP_VIEWBOX_WIDTH, y: MAP_VIEWBOX_HEIGHT })).toEqual({
      latitude: -90,
      longitude: 180,
    })
  })

  it('clamps coordinates and map points to world bounds', () => {
    expect(coordinatesToMapPoint({ latitude: 120, longitude: -220 })).toEqual({ x: 0, y: 0 })
    expect(mapPointToCoordinates({ x: 999, y: -10 })).toEqual({
      latitude: 90,
      longitude: 180,
    })
  })

  it('formats SVG polyline points from geographic coordinates', () => {
    expect(
      coordinatesToSvgPolyline([
        { latitude: 0, longitude: 0 },
        { latitude: 45, longitude: -90 },
      ]),
    ).toBe('180.00,90.00 90.00,45.00')
  })
})