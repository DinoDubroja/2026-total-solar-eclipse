import type { GeoPoint } from './projection'

// Approximate visual overlay for the map MVP. Replace with an authoritative
// Besselian/GSFC-derived path polygon before using this as scientific map data.
export const totalityCenterline: readonly GeoPoint[] = [
  { latitude: 75, longitude: 105 },
  { latitude: 82, longitude: 55 },
  { latitude: 86, longitude: 5 },
  { latitude: 76, longitude: -35 },
  { latitude: 65.2, longitude: -25.2 },
  { latitude: 64.15, longitude: -21.94 },
  { latitude: 56, longitude: -16 },
  { latitude: 47, longitude: -10 },
  { latitude: 43.53, longitude: -5.66 },
  { latitude: 41.65, longitude: -0.89 },
  { latitude: 39.6, longitude: 2.7 },
]

export const partialVisibilityPolygon: readonly GeoPoint[] = [
  { latitude: 82, longitude: -170 },
  { latitude: 88, longitude: -30 },
  { latitude: 82, longitude: 70 },
  { latitude: 58, longitude: 95 },
  { latitude: 26, longitude: 60 },
  { latitude: 6, longitude: 5 },
  { latitude: 4, longitude: -45 },
  { latitude: 18, longitude: -95 },
  { latitude: 50, longitude: -130 },
]

export const referenceCities: readonly (GeoPoint & { id: string; label: string })[] = [
  { id: 'reykjavik', label: 'Reykjavik', latitude: 64.1466, longitude: -21.9426 },
  { id: 'gijon', label: 'Gijon', latitude: 43.5322, longitude: -5.6611 },
  { id: 'zaragoza', label: 'Zaragoza', latitude: 41.6488, longitude: -0.8891 },
  { id: 'london', label: 'London', latitude: 51.5074, longitude: -0.1278 },
  { id: 'new-york', label: 'New York', latitude: 40.7128, longitude: -74.006 },
]