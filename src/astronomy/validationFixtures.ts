import { EclipseKind } from 'astronomy-engine'
import type { ObserverInput } from './observer'

interface TotalFixture {
  id: string
  label: string
  observer: ObserverInput
  kind: EclipseKind.Total
  minPeakAltitudeDegrees: number
  totalityDurationRangeSeconds: readonly [number, number]
}

interface PartialFixture {
  id: string
  label: string
  observer: ObserverInput
  kind: EclipseKind.Partial
  obscurationRange: readonly [number, number]
  minPeakAltitudeDegrees: number
}

interface NoVisible2026Fixture {
  id: string
  label: string
  observer: ObserverInput
}

export const totalEclipseFixtures: readonly TotalFixture[] = [
  {
    id: 'zaragoza-spain',
    label: 'Zaragoza, Spain',
    observer: { latitude: 41.6488, longitude: -0.8891, elevationMeters: 210 },
    kind: EclipseKind.Total,
    minPeakAltitudeDegrees: 5,
    totalityDurationRangeSeconds: [75, 100],
  },
  {
    id: 'reykjavik-iceland',
    label: 'Reykjavik, Iceland',
    observer: { latitude: 64.1466, longitude: -21.9426, elevationMeters: 40 },
    kind: EclipseKind.Total,
    minPeakAltitudeDegrees: 20,
    totalityDurationRangeSeconds: [55, 75],
  },
  {
    id: 'gijon-spain',
    label: 'Gijon, Spain',
    observer: { latitude: 43.5322, longitude: -5.6611, elevationMeters: 15 },
    kind: EclipseKind.Total,
    minPeakAltitudeDegrees: 8,
    totalityDurationRangeSeconds: [95, 120],
  },
]

export const partialOnlyEclipseFixtures: readonly PartialFixture[] = [
  {
    id: 'new-york-usa',
    label: 'New York, United States',
    observer: { latitude: 40.7128, longitude: -74.006, elevationMeters: 10 },
    kind: EclipseKind.Partial,
    obscurationRange: [0.05, 0.15],
    minPeakAltitudeDegrees: 55,
  },
  {
    id: 'london-uk',
    label: 'London, United Kingdom',
    observer: { latitude: 51.5074, longitude: -0.1278, elevationMeters: 35 },
    kind: EclipseKind.Partial,
    obscurationRange: [0.85, 0.95],
    minPeakAltitudeDegrees: 8,
  },
]

export const noVisible2026EclipseFixtures: readonly NoVisible2026Fixture[] = [
  {
    id: 'tokyo-japan',
    label: 'Tokyo, Japan',
    observer: { latitude: 35.6762, longitude: 139.6503, elevationMeters: 40 },
  },
  {
    id: 'sydney-australia',
    label: 'Sydney, Australia',
    observer: { latitude: -33.8688, longitude: 151.2093, elevationMeters: 58 },
  },
  {
    id: 'buenos-aires-argentina',
    label: 'Buenos Aires, Argentina',
    observer: { latitude: -34.6037, longitude: -58.3816, elevationMeters: 25 },
  },
]
