import { useMemo, useState, type CSSProperties } from 'react'
import { EclipseMap } from './EclipseMap'
import {
  EVENT_DURATION_MINUTES,
  EVENT_START_UTC,
  calculateEclipseObservation,
  find2026LocalEclipseCircumstances,
  type EclipseObservation,
  type EclipseStatus,
  type LocalEclipseCircumstances,
  type ObserverInput,
} from './astronomy'
import './App.css'

const DEFAULT_OBSERVER = {
  latitude: 41.6488,
  longitude: -0.8891,
  elevationMeters: 210,
}

const DEFAULT_MINUTE_OFFSET = 175

const STATUS_LABELS: Record<EclipseStatus, string> = {
  'sun-below-horizon': 'Sun below horizon',
  none: 'No eclipse',
  partial: 'Partial eclipse',
  annular: 'Annular eclipse',
  total: 'Total eclipse',
}

function formatUtcTime(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  }).format(date)
}

function formatUtcClock(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  }).format(date)
}

function formatAngle(value: number) {
  return `${value.toFixed(2)} deg`
}

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`
}

function formatDuration(seconds: number) {
  const roundedSeconds = Math.max(0, Math.round(seconds))
  const minutes = Math.floor(roundedSeconds / 60)
  const remainder = roundedSeconds % 60

  if (minutes === 0) {
    return `${remainder}s`
  }

  return `${minutes}m ${remainder.toString().padStart(2, '0')}s`
}

function clampNumber(value: number, min: number, max: number) {
  if (Number.isNaN(value)) {
    return min
  }

  return Math.min(Math.max(value, min), max)
}

function normalizeDeltaDegrees(value: number) {
  return ((((value + 180) % 360) + 360) % 360) - 180
}

function clampPercent(value: number, min = 8, max = 92) {
  return Math.min(Math.max(value, min), max)
}

function projectSkyPosition(altitudeDegrees: number, azimuthDegrees: number) {
  const altitude = Math.min(Math.max(altitudeDegrees, 0), 90)
  const radius = ((90 - altitude) / 90) * 42
  const azimuthRadians = (azimuthDegrees * Math.PI) / 180

  return {
    x: clampPercent(50 + Math.sin(azimuthRadians) * radius),
    y: clampPercent(50 - Math.cos(azimuthRadians) * radius),
    belowHorizon: altitudeDegrees < 0,
  }
}

function solarDiskStyle(observation: EclipseObservation) {
  const meanAltitude =
    ((observation.sun.altitudeDegrees + observation.moon.altitudeDegrees) / 2) *
    (Math.PI / 180)
  const azimuthDelta =
    normalizeDeltaDegrees(
      observation.moon.azimuthDegrees - observation.sun.azimuthDegrees,
    ) * Math.cos(meanAltitude)
  const altitudeDelta =
    observation.moon.altitudeDegrees - observation.sun.altitudeDegrees
  const solarRadius = observation.sun.apparentRadiusDegrees
  const scale = observation.moon.apparentRadiusDegrees / solarRadius
  const moonX = clampPercent(50 + (azimuthDelta / solarRadius) * 24, -20, 120)
  const moonY = clampPercent(50 - (altitudeDelta / solarRadius) * 24, -20, 120)

  return {
    '--moon-x': `${moonX}%`,
    '--moon-y': `${moonY}%`,
    '--moon-scale': scale.toFixed(3),
  } as CSSProperties
}

function skyBodyStyle(position: ReturnType<typeof projectSkyPosition>) {
  return {
    left: `${position.x}%`,
    top: `${position.y}%`,
  } as CSSProperties
}

function contactRows(localCircumstances: LocalEclipseCircumstances) {
  return [
    { label: 'Partial begins', event: localCircumstances.partialBegin },
    { label: 'Totality begins', event: localCircumstances.totalBegin },
    { label: 'Peak', event: localCircumstances.peak },
    { label: 'Totality ends', event: localCircumstances.totalEnd },
    { label: 'Partial ends', event: localCircumstances.partialEnd },
  ].filter((row): row is { label: string; event: NonNullable<typeof row.event> } =>
    Boolean(row.event),
  )
}

function App() {
  const [latitude, setLatitude] = useState(DEFAULT_OBSERVER.latitude)
  const [longitude, setLongitude] = useState(DEFAULT_OBSERVER.longitude)
  const [elevation, setElevation] = useState(DEFAULT_OBSERVER.elevationMeters)
  const [minuteOffset, setMinuteOffset] = useState(DEFAULT_MINUTE_OFFSET)

  const observerInput = useMemo<ObserverInput>(
    () => ({ latitude, longitude, elevationMeters: elevation }),
    [elevation, latitude, longitude],
  )
  const selectedTime = useMemo(
    () => new Date(EVENT_START_UTC + minuteOffset * 60_000),
    [minuteOffset],
  )
  const observation = useMemo(
    () => calculateEclipseObservation(observerInput, selectedTime),
    [observerInput, selectedTime],
  )
  const localCircumstances = useMemo(
    () => find2026LocalEclipseCircumstances(observerInput),
    [observerInput],
  )

  const sunPosition = projectSkyPosition(
    observation.sun.altitudeDegrees,
    observation.sun.azimuthDegrees,
  )
  const moonPosition = projectSkyPosition(
    observation.moon.altitudeDegrees,
    observation.moon.azimuthDegrees,
  )

  return (
    <main className="app-shell">
      <section className="workspace">
        <div className="control-panel">
          <div className="brand-row">
            <div className="brand-mark" aria-hidden="true">
              <span />
            </div>
            <div>
              <p className="app-name">2026 Eclipse Planner</p>
              <p className="app-status">Astronomy core active</p>
            </div>
          </div>

          <div className="field-grid" aria-label="Observer coordinates">
            <label>
              Latitude
              <input
                type="number"
                inputMode="decimal"
                value={latitude}
                min={-90}
                max={90}
                step={0.0001}
                onChange={(event) =>
                  setLatitude(clampNumber(event.target.valueAsNumber, -90, 90))
                }
              />
            </label>
            <label>
              Longitude
              <input
                type="number"
                inputMode="decimal"
                value={longitude}
                min={-180}
                max={180}
                step={0.0001}
                onChange={(event) =>
                  setLongitude(
                    clampNumber(event.target.valueAsNumber, -180, 180),
                  )
                }
              />
            </label>
            <label>
              Elevation m
              <input
                type="number"
                inputMode="decimal"
                value={elevation}
                min={-500}
                max={9000}
                step={1}
                onChange={(event) =>
                  setElevation(
                    clampNumber(event.target.valueAsNumber, -500, 9000),
                  )
                }
              />
            </label>
          </div>

          <label className="time-control">
            Event time
            <input
              type="range"
              min={0}
              max={EVENT_DURATION_MINUTES}
              value={minuteOffset}
              onChange={(event) =>
                setMinuteOffset(Number.parseInt(event.target.value, 10))
              }
            />
          </label>

          <div className="readout-list" aria-label="Current selection">
            <div>
              <span>UTC time</span>
              <strong>{formatUtcTime(selectedTime)}</strong>
            </div>
            <div>
              <span>Observer</span>
              <strong>
                {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </strong>
            </div>
            <div>
              <span>Elevation</span>
              <strong>{Math.round(elevation)} m ephemeris input</strong>
            </div>
            <div>
              <span>Sun alt / az</span>
              <strong>
                {formatAngle(observation.sun.altitudeDegrees)} /{' '}
                {formatAngle(observation.sun.azimuthDegrees)}
              </strong>
            </div>
            <div>
              <span>Moon alt / az</span>
              <strong>
                {formatAngle(observation.moon.altitudeDegrees)} /{' '}
                {formatAngle(observation.moon.azimuthDegrees)}
              </strong>
            </div>
          </div>
        </div>

        <div className="sky-panel">
          <div className="panel-header">
            <div>
              <h1>Sky Preview</h1>
              <p>Direction markers for the local horizon</p>
            </div>
            <div className="coverage-meter">
              <span>{formatPercent(observation.obscuration)}</span>
              <small>{STATUS_LABELS[observation.status]}</small>
            </div>
          </div>

          <div className="sky-view" aria-label="Local horizon preview">
            <div className="azimuth-label north">N</div>
            <div className="azimuth-label east">E</div>
            <div className="azimuth-label south">S</div>
            <div className="azimuth-label west">W</div>
            <div className="horizon-line" />
            <div
              className={`sky-body sun-marker${sunPosition.belowHorizon ? ' below-horizon' : ''}`}
              style={skyBodyStyle(sunPosition)}
              title={`Sun direction: ${formatAngle(observation.sun.altitudeDegrees)} altitude, ${formatAngle(observation.sun.azimuthDegrees)} azimuth`}
              aria-label={`Sun direction ${formatAngle(observation.sun.altitudeDegrees)} altitude, ${formatAngle(observation.sun.azimuthDegrees)} azimuth`}
            />
            <div
              className={`sky-body moon-marker${moonPosition.belowHorizon ? ' below-horizon' : ''}`}
              style={skyBodyStyle(moonPosition)}
              title={`Moon direction: ${formatAngle(observation.moon.altitudeDegrees)} altitude, ${formatAngle(observation.moon.azimuthDegrees)} azimuth`}
              aria-label={`Moon direction ${formatAngle(observation.moon.altitudeDegrees)} altitude, ${formatAngle(observation.moon.azimuthDegrees)} azimuth`}
            />
          </div>

          <EclipseMap
            latitude={latitude}
            longitude={longitude}
            onSelectCoordinates={(coordinates) => {
              setLatitude(Number(coordinates.latitude.toFixed(4)))
              setLongitude(Number(coordinates.longitude.toFixed(4)))
            }}
          />

          <div className="details-grid">
            <article className="solar-card">
              <span>Solar disk</span>
              <div className="solar-disc-preview" style={solarDiskStyle(observation)}>
                <div className="solar-sun" />
                <div className="solar-moon" />
              </div>
              <p>
                Separation {formatAngle(observation.separationDegrees)}; Sun radius{' '}
                {formatAngle(observation.sun.apparentRadiusDegrees)}, Moon radius{' '}
                {formatAngle(observation.moon.apparentRadiusDegrees)}.
              </p>
            </article>
            <article className="event-card">
              <span>Local 2026 event</span>
              {localCircumstances ? (
                <>
                  <div className="event-summary">
                    <strong>{localCircumstances.kind} eclipse</strong>
                    <small>
                      {localCircumstances.totalityDurationSeconds === undefined
                        ? `Max ${formatPercent(localCircumstances.obscuration)}`
                        : `Totality ${formatDuration(
                            localCircumstances.totalityDurationSeconds,
                          )}`}
                    </small>
                  </div>
                  <div className="contact-list" aria-label="Local eclipse contact times">
                    {contactRows(localCircumstances).map((row) => (
                      <div key={row.label}>
                        <span>{row.label}</span>
                        <strong>{formatUtcClock(row.event.time)}</strong>
                        <small>{formatAngle(row.event.sunAltitudeDegrees)}</small>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <strong>Not visible here</strong>
                  <p>No visible local 2026 eclipse found for this observer.</p>
                </>
              )}
            </article>
            <article>
              <span>Terrain horizon</span>
              <strong>Pending</strong>
              <p>Elevation-aware terrain and building blockage come with 3D mode.</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
