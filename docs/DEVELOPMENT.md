# Development Workflow

Use the local project workspace:

```text
C:\Projects\2026_Total_Solar_Eclipse\2026-total-solar-eclipse
```

Install dependencies:

```powershell
pnpm install
```

Start the dev server:

```powershell
pnpm dev
```

Before committing, run:

```powershell
pnpm lint
pnpm build
```

Work in small milestones:

- scaffold and project documentation
- astronomy calculation core
- map data and coordinate selection
- 3D horizon view
- terrain/building visualization

Keep generated exports, screenshots, large imagery, and planning references in the OneDrive project folder unless a small source file is useful in Git.
