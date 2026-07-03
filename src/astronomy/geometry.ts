import { KM_PER_AU } from 'astronomy-engine'

export function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180
}

export function radiansToDegrees(radians: number) {
  return (radians * 180) / Math.PI
}

export function apparentAngularRadiusDegrees(radiusKm: number, distanceAu: number) {
  return radiansToDegrees(Math.asin(radiusKm / (distanceAu * KM_PER_AU)))
}

export function angularSeparationDegrees(
  rightAscensionHoursA: number,
  declinationDegreesA: number,
  rightAscensionHoursB: number,
  declinationDegreesB: number,
) {
  const raA = degreesToRadians(rightAscensionHoursA * 15)
  const raB = degreesToRadians(rightAscensionHoursB * 15)
  const decA = degreesToRadians(declinationDegreesA)
  const decB = degreesToRadians(declinationDegreesB)
  const cosine =
    Math.sin(decA) * Math.sin(decB) +
    Math.cos(decA) * Math.cos(decB) * Math.cos(raA - raB)

  return radiansToDegrees(Math.acos(Math.min(1, Math.max(-1, cosine))))
}

export function obscurationFraction(
  sunRadiusDegrees: number,
  moonRadiusDegrees: number,
  separationDegrees: number,
) {
  const rSun = sunRadiusDegrees
  const rMoon = moonRadiusDegrees
  const d = separationDegrees

  if (d >= rSun + rMoon) {
    return 0
  }

  if (d <= Math.abs(rSun - rMoon)) {
    const coveredRadius = Math.min(rSun, rMoon)
    const coveredArea = Math.PI * coveredRadius * coveredRadius
    const sunArea = Math.PI * rSun * rSun

    return Math.min(1, coveredArea / sunArea)
  }

  const sunTerm =
    rSun *
    rSun *
    Math.acos((d * d + rSun * rSun - rMoon * rMoon) / (2 * d * rSun))
  const moonTerm =
    rMoon *
    rMoon *
    Math.acos((d * d + rMoon * rMoon - rSun * rSun) / (2 * d * rMoon))
  const triangleTerm =
    0.5 *
    Math.sqrt(
      Math.max(
        0,
        (-d + rSun + rMoon) *
          (d + rSun - rMoon) *
          (d - rSun + rMoon) *
          (d + rSun + rMoon),
      ),
    )

  return Math.min(1, Math.max(0, (sunTerm + moonTerm - triangleTerm) / (Math.PI * rSun * rSun)))
}

export type EclipseStatus = 'sun-below-horizon' | 'none' | 'partial' | 'annular' | 'total'

export function classifyEclipseStatus(
  sunAltitudeDegrees: number,
  sunRadiusDegrees: number,
  moonRadiusDegrees: number,
  separationDegrees: number,
): EclipseStatus {
  if (sunAltitudeDegrees < 0) {
    return 'sun-below-horizon'
  }

  if (separationDegrees >= sunRadiusDegrees + moonRadiusDegrees) {
    return 'none'
  }

  if (separationDegrees <= moonRadiusDegrees - sunRadiusDegrees) {
    return 'total'
  }

  if (separationDegrees <= sunRadiusDegrees - moonRadiusDegrees) {
    return 'annular'
  }

  return 'partial'
}
