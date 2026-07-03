export const EVENT_START_UTC = Date.UTC(2026, 7, 12, 15, 35)
export const EVENT_END_UTC = Date.UTC(2026, 7, 12, 19, 59)
export const EVENT_SEARCH_START_UTC = Date.UTC(2026, 7, 1, 0, 0)
export const EVENT_DURATION_MINUTES = Math.round(
  (EVENT_END_UTC - EVENT_START_UTC) / 60_000,
)

export const SUN_RADIUS_KM = 695_700
export const MOON_RADIUS_KM = 1_737.4
