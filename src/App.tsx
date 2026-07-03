import { useMemo, useState } from 'react'
import './App.css'

const EVENT_START_UTC = Date.UTC(2026, 7, 12, 15, 35)
const EVENT_END_UTC = Date.UTC(2026, 7, 12, 19, 59)
const EVENT_DURATION_MINUTES = Math.round(
  (EVENT_END_UTC - EVENT_START_UTC) / 60_000,
)

const DEFAULT_OBSERVER = {
  latitude: 41.6488,
  longitude: -0.8891,
  elevation: 210,
}

function formatUtcTime(totalMinutes: number) {
  const date = new Date(EVENT_START_UTC + totalMinutes * 60_000)

  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  }).format(date)
}

function clampNumber(value: number, min: number, max: number) {
  if (Number.isNaN(value)) {
    return min
  }

  return Math.min(Math.max(value, min), max)
}

function App() {
  const [latitude, setLatitude] = useState(DEFAULT_OBSERVER.latitude)
  const [longitude, setLongitude] = useState(DEFAULT_OBSERVER.longitude)
  const [elevation, setElevation] = useState(DEFAULT_OBSERVER.elevation)
  const [minuteOffset, setMinuteOffset] = useState(104)

  const preview = useMemo(() => {
    const progress = minuteOffset / EVENT_DURATION_MINUTES
    const sunX = 12 + progress * 76
    const sunY = 66 - Math.sin(progress * Math.PI) * 38
    const moonOffset = (progress - 0.5) * 44

    return {
      progress,
      sunX,
      sunY,
      moonX: sunX + moonOffset,
      moonY: sunY - 1.5,
      coverage: Math.max(0, 1 - Math.abs(progress - 0.5) * 2),
    }
  }, [minuteOffset])

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
              <p className="app-status">Local prototype</p>
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
              <strong>{formatUtcTime(minuteOffset)}</strong>
            </div>
            <div>
              <span>Observer</span>
              <strong>
                {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </strong>
            </div>
            <div>
              <span>Elevation</span>
              <strong>{Math.round(elevation)} m</strong>
            </div>
          </div>
        </div>

        <div className="sky-panel">
          <div className="panel-header">
            <div>
              <h1>Sky Preview</h1>
              <p>Sun and Moon geometry placeholder</p>
            </div>
            <div className="coverage-meter">
              <span>{Math.round(preview.coverage * 100)}%</span>
              <small>demo overlap</small>
            </div>
          </div>

          <div className="sky-view" aria-label="Local horizon preview">
            <div className="azimuth-label north">N</div>
            <div className="azimuth-label east">E</div>
            <div className="azimuth-label south">S</div>
            <div className="azimuth-label west">W</div>
            <div className="horizon-line" />
            <div
              className="sun-disc"
              style={{
                left: `${preview.sunX}%`,
                top: `${preview.sunY}%`,
              }}
            />
            <div
              className="moon-disc"
              style={{
                left: `${preview.moonX}%`,
                top: `${preview.moonY}%`,
              }}
            />
          </div>

          <div className="status-grid">
            <article>
              <span>Calculation core</span>
              <strong>Next</strong>
              <p>Wire in tested Sun, Moon, and observer geometry.</p>
            </article>
            <article>
              <span>Map layer</span>
              <strong>Next</strong>
              <p>Add totality path data and coordinate selection.</p>
            </article>
            <article>
              <span>3D terrain</span>
              <strong>Later</strong>
              <p>Use Cesium and Google 3D Tiles after API setup.</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
