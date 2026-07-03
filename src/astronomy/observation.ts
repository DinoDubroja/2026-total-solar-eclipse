import {
  Body,
  EclipseKind,
  Equator,
  Horizon,
  SearchLocalSolarEclipse,
} from 'astronomy-engine'
import {
  EVENT_END_UTC,
  EVENT_SEARCH_START_UTC,
  EVENT_START_UTC,
  MOON_RADIUS_KM,
  SUN_RADIUS_KM,
} from './constants'
import {
  angularSeparationDegrees,
  apparentAngularRadiusDegrees,
  classifyEclipseStatus,
  obscurationFraction,
  type EclipseStatus,
} from './geometry'
import { createObserver, type ObserverInput } from './observer'

export interface BodyObservation {
  altitudeDegrees: number
  azimuthDegrees: number
  apparentRadiusDegrees: number
  distanceAu: number
}

export interface EclipseObservation {
  time: Date
  sun: BodyObservation
  moon: BodyObservation
  separationDegrees: number
  obscuration: number
  status: EclipseStatus
}

export interface EclipseEventSummary {
  time: Date
  sunAltitudeDegrees: number
}

export interface LocalEclipseCircumstances {
  kind: EclipseKind
  obscuration: number
  partialBegin: EclipseEventSummary
  totalBegin?: EclipseEventSummary
  peak: EclipseEventSummary
  totalEnd?: EclipseEventSummary
  partialEnd: EclipseEventSummary
  partialDurationSeconds: number
  totalityDurationSeconds?: number
}

function observeBody(
  body: Body.Sun | Body.Moon,
  date: Date,
  observer: ReturnType<typeof createObserver>,
): BodyObservation {
  const equatorial = Equator(body, date, observer, true, true)
  const horizontal = Horizon(date, observer, equatorial.ra, equatorial.dec, 'normal')
  const bodyRadiusKm = body === Body.Sun ? SUN_RADIUS_KM : MOON_RADIUS_KM

  return {
    altitudeDegrees: horizontal.altitude,
    azimuthDegrees: horizontal.azimuth,
    apparentRadiusDegrees: apparentAngularRadiusDegrees(bodyRadiusKm, equatorial.dist),
    distanceAu: equatorial.dist,
  }
}

export function calculateEclipseObservation(
  observerInput: ObserverInput,
  time: Date,
): EclipseObservation {
  const observer = createObserver(observerInput)
  const sunEquatorial = Equator(Body.Sun, time, observer, true, true)
  const moonEquatorial = Equator(Body.Moon, time, observer, true, true)
  const sunHorizontal = Horizon(time, observer, sunEquatorial.ra, sunEquatorial.dec, 'normal')
  const moonHorizontal = Horizon(
    time,
    observer,
    moonEquatorial.ra,
    moonEquatorial.dec,
    'normal',
  )
  const sunRadius = apparentAngularRadiusDegrees(SUN_RADIUS_KM, sunEquatorial.dist)
  const moonRadius = apparentAngularRadiusDegrees(MOON_RADIUS_KM, moonEquatorial.dist)
  const separation = angularSeparationDegrees(
    sunEquatorial.ra,
    sunEquatorial.dec,
    moonEquatorial.ra,
    moonEquatorial.dec,
  )

  return {
    time,
    sun: {
      altitudeDegrees: sunHorizontal.altitude,
      azimuthDegrees: sunHorizontal.azimuth,
      apparentRadiusDegrees: sunRadius,
      distanceAu: sunEquatorial.dist,
    },
    moon: {
      altitudeDegrees: moonHorizontal.altitude,
      azimuthDegrees: moonHorizontal.azimuth,
      apparentRadiusDegrees: moonRadius,
      distanceAu: moonEquatorial.dist,
    },
    separationDegrees: separation,
    obscuration: obscurationFraction(sunRadius, moonRadius, separation),
    status: classifyEclipseStatus(sunHorizontal.altitude, sunRadius, moonRadius, separation),
  }
}

function summarizeEvent(event: { time: { date: Date }; altitude: number }): EclipseEventSummary {
  return {
    time: event.time.date,
    sunAltitudeDegrees: event.altitude,
  }
}

function secondsBetween(start: Date, end: Date) {
  return (end.getTime() - start.getTime()) / 1000
}

export function find2026LocalEclipseCircumstances(
  observerInput: ObserverInput,
): LocalEclipseCircumstances | null {
  const observer = createObserver(observerInput)
  const local = SearchLocalSolarEclipse(new Date(EVENT_SEARCH_START_UTC), observer)
  const peakTime = local.peak.time.date.getTime()
  const eventWindowPaddingMs = 12 * 60 * 60 * 1000

  if (
    peakTime < EVENT_START_UTC - eventWindowPaddingMs ||
    peakTime > EVENT_END_UTC + eventWindowPaddingMs
  ) {
    return null
  }

  const partialBegin = summarizeEvent(local.partial_begin)
  const partialEnd = summarizeEvent(local.partial_end)
  const totalBegin = local.total_begin ? summarizeEvent(local.total_begin) : undefined
  const totalEnd = local.total_end ? summarizeEvent(local.total_end) : undefined

  return {
    kind: local.kind,
    obscuration: local.obscuration,
    partialBegin,
    totalBegin,
    peak: summarizeEvent(local.peak),
    totalEnd,
    partialEnd,
    partialDurationSeconds: secondsBetween(partialBegin.time, partialEnd.time),
    totalityDurationSeconds:
      totalBegin && totalEnd ? secondsBetween(totalBegin.time, totalEnd.time) : undefined,
  }
}

export function bodyObservationAt(
  observerInput: ObserverInput,
  time: Date,
  body: Body.Sun | Body.Moon,
) {
  return observeBody(body, time, createObserver(observerInput))
}
