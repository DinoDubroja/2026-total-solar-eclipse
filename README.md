# 2026 Total Solar Eclipse Planner

Interactive planning app for the total solar eclipse on 12 August 2026.

The project is a browser-based planning console. It now has a tested astronomy core for topocentric Sun/Moon geometry, local contact times, apparent disk overlap, broad visibility fixtures, a Google Maps 3D-ready planning surface, and an approximate clickable coverage overlay.

## Run Locally

Install Node.js LTS if you are running the project outside Codex.

```powershell
pnpm install
pnpm dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

Google 3D maps are optional during local development. To enable them, create `.env.local` and add:

```text
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_platform_key
```

Without that key, the app keeps the local coverage selector visible so coordinate testing still works.

## Scripts

```powershell
pnpm test
pnpm lint
pnpm build
pnpm preview
```

## Project Status

Current milestone:

- React, TypeScript, and Vite project scaffold
- coordinate/time screen backed by astronomy calculations
- tested Sun/Moon apparent geometry, angular overlap, and eclipse status classification
- local 2026 eclipse contact times and totality duration for selected observer coordinates
- broad regression fixtures for total, partial-only, and no-visible 2026 locations
- Google Maps 3D-ready planning surface with local fallback
- approximate 2D coverage selector with click-to-set observer coordinates
- symbolic sky direction markers separated from the apparent solar disk view
- reproducible dependency lockfile
- GitHub repository connected

Next milestones:

- wire eclipse path overlays into the Google map surface
- replace approximate map overlay with authoritative path data
- add clearer time controls for stepping minute by minute
- add 3D horizon and terrain planning mode

## Source Data Direction

The scientific layer should use trusted eclipse and ephemeris sources:

- Astronomy Engine for topocentric Sun/Moon coordinates and local solar eclipse circumstances
- NASA eclipse/Besselian data for independent validation of the 2026 August 12 event
- open terrain data for numeric horizon analysis when needed
- Google Maps JavaScript 3D Maps as the visual planning layer after API setup

## Repository Layout

```text
src/
  App.tsx             app shell and state wiring
  App.css             app-specific layout and components
  EclipseMap.tsx      planning map surface and local coverage selector
  GoogleMaps3dView.tsx Google Maps 3D mount point
  astronomy/          astronomy calculations and tests
  map/                map projection and approximate overlay data
  maps/               Google Maps loader helpers
  index.css           global design tokens and base styles
docs/
  DEVELOPMENT.md      development workflow
  PRODUCT_PLAN.md     product direction and milestones
  VALIDATION.md       validation fixtures and source direction
```

Large references, planning exports, screenshots, and non-source material belong in the OneDrive project folder rather than this Git repository.
