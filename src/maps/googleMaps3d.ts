const GOOGLE_MAPS_3D_SCRIPT_ID = 'google-maps-3d-script'

let googleMaps3dLoadPromise: Promise<void> | undefined

export function getGoogleMapsApiKey() {
  return import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? ''
}

export function buildGoogleMaps3dUrl(apiKey: string) {
  const url = new URL('https://maps.googleapis.com/maps/api/js')
  url.searchParams.set('loading', 'async')
  url.searchParams.set('key', apiKey)
  url.searchParams.set('libraries', 'maps3d')

  return url.toString()
}

export function loadGoogleMaps3d(apiKey: string) {
  if (!apiKey) {
    return Promise.reject(new Error('Google Maps API key is missing'))
  }

  if (googleMaps3dLoadPromise) {
    return googleMaps3dLoadPromise
  }

  googleMaps3dLoadPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_MAPS_3D_SCRIPT_ID)

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true })
      existingScript.addEventListener('error', () => reject(new Error('Google Maps failed to load')), {
        once: true,
      })
      return
    }

    const script = document.createElement('script')
    script.id = GOOGLE_MAPS_3D_SCRIPT_ID
    script.async = true
    script.src = buildGoogleMaps3dUrl(apiKey)
    script.addEventListener('load', () => resolve(), { once: true })
    script.addEventListener('error', () => reject(new Error('Google Maps failed to load')), {
      once: true,
    })

    document.head.append(script)
  })

  return googleMaps3dLoadPromise
}
