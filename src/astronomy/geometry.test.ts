import { describe, expect, it } from 'vitest'
import {
  angularSeparationDegrees,
  apparentAngularRadiusDegrees,
  classifyEclipseStatus,
  obscurationFraction,
} from './geometry'

const closeTo = (value: number, expected: number, precision = 6) => {
  expect(value).toBeCloseTo(expected, precision)
}

describe('astronomy geometry helpers', () => {
  it('calculates apparent angular radius in degrees', () => {
    closeTo(apparentAngularRadiusDegrees(1, 1), 0.000000383047, 10)
  })

  it('calculates angular separation from equatorial coordinates', () => {
    closeTo(angularSeparationDegrees(0, 0, 1, 0), 15)
    closeTo(angularSeparationDegrees(0, 0, 0, 1), 1)
  })

  it('classifies non-overlap, partial, total, and below-horizon states', () => {
    expect(classifyEclipseStatus(10, 0.25, 0.27, 1)).toBe('none')
    expect(classifyEclipseStatus(10, 0.25, 0.27, 0.4)).toBe('partial')
    expect(classifyEclipseStatus(10, 0.25, 0.28, 0.02)).toBe('total')
    expect(classifyEclipseStatus(-1, 0.25, 0.28, 0.02)).toBe('sun-below-horizon')
  })

  it('calculates obscuration across overlap regimes', () => {
    expect(obscurationFraction(0.25, 0.27, 1)).toBe(0)
    expect(obscurationFraction(0.25, 0.27, 0)).toBe(1)
    expect(obscurationFraction(0.25, 0.2, 0)).toBeCloseTo(0.64)
    expect(obscurationFraction(0.25, 0.25, 0.25)).toBeGreaterThan(0)
    expect(obscurationFraction(0.25, 0.25, 0.25)).toBeLessThan(1)
  })
})
