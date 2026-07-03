import { describe, expect, it } from 'vitest'
import { buildGoogleMaps3dUrl } from './googleMaps3d'

describe('Google Maps 3D loader helpers', () => {
  it('builds the Maps JavaScript URL with the 3D library enabled', () => {
    const url = new URL(buildGoogleMaps3dUrl('test-key'))

    expect(url.origin).toBe('https://maps.googleapis.com')
    expect(url.pathname).toBe('/maps/api/js')
    expect(url.searchParams.get('loading')).toBe('async')
    expect(url.searchParams.get('key')).toBe('test-key')
    expect(url.searchParams.get('libraries')).toBe('maps3d')
  })
})
