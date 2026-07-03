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

Next MVP refinements:

- add clearer time controls for stepping minute by minute
- add a compact manual test script for each planning workflow
- add more validation fixtures across total, partial-only, and no-eclipse locations

## Map View

- show the totality path and central line
- show broader partial-eclipse visibility when data is available
- allow clicking the map to set observer coordinates
- keep manual coordinate entry available

## 3D Planning View

- render a local sky dome with horizon direction labels
- add orbit/pan controls for inspection
- overlay the Sun direction at selected times
- later, use Cesium with Google Photorealistic 3D Tiles for visual terrain and building context

## Scientific Core

Implemented foundation:

- separate astronomy calculations from UI components
- calculate topocentric Sun and Moon altitude/azimuth
- calculate apparent angular radii, separation, obscuration, and eclipse status
- find local 2026 eclipse circumstances for the selected observer
- calculate partial duration and totality duration when contacts exist
- unit-test geometry and Zaragoza totality behavior

Next validation work:

- validate sample locations against trusted eclipse references
- document independent source datasets and validation tolerances
- add regression fixtures for locations inside totality, partial-only regions, and no-eclipse regions

## User Testing

Each feature should ship with a short test script:

- what to open
- what to change
- what result to expect
- what values need manual sanity-checking
