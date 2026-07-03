# Product Plan

## Goal

Build an eclipse planning app where an observer can choose coordinates and inspect the 12 August 2026 eclipse relative to the local horizon.

## MVP

Implemented foundation:

- enter latitude, longitude, and elevation
- scrub through the global eclipse time window
- render Sun and Moon apparent overlap
- show Sun and Moon direction markers relative to the local horizon
- report eclipse visibility, contact times, and totality duration for the selected location
- select observer coordinates from an approximate 2D coverage overlay
- render a Google Maps 3D-ready planning surface when an API key is configured
- adjust the planning camera with heading, tilt, and range controls
- show a selected-location summary in the map context

Next MVP refinements:

- add clearer time controls for stepping minute by minute
- add a compact manual test script for each planning workflow
- add independent validation tolerances for contact times and obscuration

## Map View

Implemented foundation:

- reserve the primary map area for Google Maps 3D
- keep camera controls next to the 3D planning surface
- show current eclipse state, local event, local peak, and Sun direction above the map
- show an approximate totality path and central line in a local coverage selector
- show a broad partial-eclipse visibility overlay
- allow selecting observer coordinates from the coverage selector
- keep manual coordinate entry available

Next map work:

- validate live Google Maps 3D rendering with an API key
- move totality and partial-visibility overlays onto the Google map surface
- replace approximate overlay geometry with authoritative path data
- show clicked coordinates with local eclipse summary directly on the map

## 3D Planning View

- render a local sky dome with horizon direction labels
- add orbit/pan controls for inspection
- overlay the Sun direction at selected times
- use Google Maps JavaScript 3D Maps for visual terrain and building context

## Scientific Core

Implemented foundation:

- separate astronomy calculations from UI components
- calculate topocentric Sun and Moon altitude/azimuth
- calculate apparent angular radii, separation, obscuration, and eclipse status
- find local 2026 eclipse circumstances for the selected observer
- calculate partial duration and totality duration when contacts exist
- unit-test geometry and Zaragoza totality behavior
- regression-test total, partial-only, and no-visible 2026 fixture locations
- unit-test map projection round trips for click-to-coordinate behavior

Next validation work:

- validate sample locations against trusted eclipse references
- document independent source datasets and numerical tolerances
- add fixtures for contact-time, magnitude, altitude, and azimuth tolerances

## User Testing

Each feature should ship with a short test script:

- what to open
- what to change
- what result to expect
- what values need manual sanity-checking
