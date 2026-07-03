# 2026 Total Solar Eclipse Planner

Interactive planning app for the total solar eclipse on 12 August 2026.

The project is starting with a browser-based planning console. The first goal is a dependable local workflow, then a tested astronomy core, then map and 3D terrain views.

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

## Scripts

```powershell
pnpm lint
pnpm build
pnpm preview
```

## Project Status

Current milestone:

- React, TypeScript, and Vite project scaffold
- local coordinate/time prototype screen
- reproducible dependency lockfile
- GitHub repository connected

Next milestones:

- add tested Sun/Moon/observer geometry
- validate eclipse overlap calculations against trusted references
- add totality path map data
- add 3D horizon and terrain planning mode

## Source Data Direction

The scientific layer should use trusted eclipse and ephemeris sources:

- NASA eclipse/Besselian data for the 2026 August 12 event
- Sun and Moon topocentric geometry from a tested astronomy library or generated ephemeris dataset
- open terrain data for numeric horizon analysis when needed
- Google Photorealistic 3D Tiles as an optional visual planning layer after API setup

## Repository Layout

```text
src/
  App.tsx        app shell and state wiring
  App.css        app-specific layout and components
  index.css      global design tokens and base styles
docs/
  DEVELOPMENT.md development workflow
  PRODUCT_PLAN.md product direction and milestones
```

Large references, planning exports, screenshots, and non-source material belong in the OneDrive project folder rather than this Git repository.
