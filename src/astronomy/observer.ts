import { Observer } from 'astronomy-engine'

export interface ObserverInput {
  latitude: number
  longitude: number
  elevationMeters: number
}

export function assertObserverInput(input: ObserverInput) {
  if (!Number.isFinite(input.latitude) || input.latitude < -90 || input.latitude > 90) {
    throw new RangeError('Latitude must be between -90 and 90 degrees.')
  }

  if (
    !Number.isFinite(input.longitude) ||
    input.longitude < -180 ||
    input.longitude > 180
  ) {
    throw new RangeError('Longitude must be between -180 and 180 degrees.')
  }

  if (!Number.isFinite(input.elevationMeters)) {
    throw new RangeError('Elevation must be a finite number of meters.')
  }
}

export function createObserver(input: ObserverInput) {
  assertObserverInput(input)

  return new Observer(input.latitude, input.longitude, input.elevationMeters)
}
