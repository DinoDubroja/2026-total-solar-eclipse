import { EclipseKind } from 'astronomy-engine'
import { describe, expect, it } from 'vitest'
import {
  calculateEclipseObservation,
  find2026LocalEclipseCircumstances,
} from './observation'

const zaragoza = {
  latitude: 41.6488,
  longitude: -0.8891,
  elevationMeters: 210,
}

describe('eclipse observation core', () => {
  it('calculates coordinate-dependent Sun and Moon positions', () => {
    const time = new Date('2026-08-12T18:00:00Z')
    const spain = calculateEclipseObservation(zaragoza, time)
    const newYork = calculateEclipseObservation(
      { latitude: 40.7128, longitude: -74.006, elevationMeters: 10 },
      time,
    )

    expect(spain.sun.altitudeDegrees).toBeGreaterThan(11)
    expect(spain.sun.altitudeDegrees).toBeLessThan(14)
    expect(spain.sun.azimuthDegrees).toBeGreaterThan(278)
    expect(spain.sun.azimuthDegrees).toBeLessThan(282)
    expect(spain.status).toBe('partial')
    expect(spain.obscuration).toBeGreaterThan(0)
    expect(Math.abs(spain.sun.azimuthDegrees - newYork.sun.azimuthDegrees)).toBeGreaterThan(10)
  })

  it('finds ordered 2026 local total eclipse circumstances for Zaragoza', () => {
    const local = find2026LocalEclipseCircumstances(zaragoza)

    expect(local).not.toBeNull()
    expect(local?.kind).toBe(EclipseKind.Total)
    expect(local?.obscuration).toBe(1)
    expect(local?.peak.time.toISOString()).toMatch(/^2026-08-12T18:29:/)
    expect(local?.peak.sunAltitudeDegrees).toBeGreaterThan(5)
    expect(local?.totalBegin).toBeDefined()
    expect(local?.totalEnd).toBeDefined()

    if (!local?.totalBegin || !local.totalEnd) {
      throw new Error('Expected Zaragoza to have totality contacts')
    }

    expect(local.partialBegin.time.getTime()).toBeLessThan(local.totalBegin.time.getTime())
    expect(local.totalBegin.time.getTime()).toBeLessThan(local.peak.time.getTime())
    expect(local.peak.time.getTime()).toBeLessThan(local.totalEnd.time.getTime())
    expect(local.totalEnd.time.getTime()).toBeLessThan(local.partialEnd.time.getTime())
    expect(local.totalityDurationSeconds).toBeGreaterThan(60)
    expect(local.partialDurationSeconds).toBeGreaterThan(local.totalityDurationSeconds ?? 0)
  })
})
