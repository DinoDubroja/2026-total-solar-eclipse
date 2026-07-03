# Product Plan

## Goal

Build an eclipse planning app where an observer can choose coordinates and inspect the 12 August 2026 eclipse relative to the local horizon.

## MVP

- enter latitude, longitude, and elevation
- scrub through the global eclipse time window
- render Sun and Moon apparent overlap
- show Sun position relative to the local horizon
- report eclipse visibility and key event times for the selected location

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

- separate astronomy calculations from UI components
- write unit tests around geometry and contact-time calculations
- validate sample locations against trusted eclipse references
- keep source datasets documented and reproducible

## User Testing

Each feature should ship with a short test script:

- what to open
- what to change
- what result to expect
- what values need manual sanity-checking
