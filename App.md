App Overview

This is a small single-page React application (Vite + TypeScript) for managing local applications and viewing their runtime details. It provides an apps dashboard, a list of applications, per-application details (process info, environment variables and a live logs card), dedicated logs pages and simple process/environment overviews.

Key pages
- Dashboard: high-level overview and quick stats.
- Apps: list of managed applications.
- App Details: shows app metadata, process information, Environment Variables (editable) and an inline "Live Logs" card that scrolls with the page.
- App Logs: full-page logs viewer with search/filters.
- Processes / Environment / Logs: additional views for system/process-level data.

Structure and components
- src/pages: top-level pages mapped in src/lib/routes/main.routes.tsx.
- src/components/atoms: basic UI primitives (Button, Badge, Input, etc.).
- src/components/molecules: composite UI parts (EnvVarRow/Form, LogEntryRow, cards and empty states).
- src/components/organisms: larger layout pieces (Sidebar, layout pieces).
- src/context: ThemeProvider used at app root (src/main.tsx).
- src/mocks: mock data used to populate pages during development.

Tech & scripts
- Built with React + TypeScript, Vite, Tailwind CSS and iconsax icons.
- Run locally: npm run dev; build: npm run build; preview: npm run preview.

Notes for contributors
- Routes are centralized at src/lib/routes/main.routes.tsx.
- The App Details page composes several molecule components and uses mock data under src/mocks; replace mocks with real API calls to integrate with a backend.
- Styling patterns use utility classes (Tailwind) and consistent card styles; new cards should follow the existing card markup used for Environment Variables.

This README-style file is intentionally brief — use it as a quick reference to the app's purpose, layout and where to find the main pieces of code.