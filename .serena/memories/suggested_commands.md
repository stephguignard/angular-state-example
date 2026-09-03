# Suggested commands

Run `nvm use` first (Node 22.23.2 per `.nvmrc`) for install/build.

## Dev / build
- `npm start` / `ng serve` — dev server at http://localhost:4200/
- `ng build` — prod build → `dist/` (requires Node 22.23.2)
- `npm run watch` — `ng build --watch --configuration development`

## Test
- `npm test` / `npx jest` — unit tests, single run (no watch by default)
- `npm run test:watch` — Jest watch mode
- `npx jest <fragment>` — takes a **filename regex, not a glob**
  (e.g. `npx jest todo.store`, `npx jest user-search`)
- `npm run e2e` — Playwright smoke (`e2e/*.e2e.ts`); starts its own `ng serve`.
  One-time: `npx playwright install chromium`. NOT a full e2e suite.

## Scaffolding
- `ng generate component features/<feature>/...` — CLI schematics, style: scss.
- Feature routing files are `*.routes.ts` returning `Routes`, consumed by `loadChildren`
  in `app.routes.ts` (not `loadComponent`-per-route).

## Serena
- Index code symbols: `uvx --from serena-agent serena project index [PATH]`
  (writes `.serena/cache/`; incremental afterwards). No separate first-time command.
- `serena memories check` — report stale memory references.

## No-ops
- `ng test` — no `test` target in `angular.json`.
- `npm run lint` — does not exist (no ESLint/Prettier).

## System
Standard Linux/GNU coreutils; nothing repo-specific differs from a normal unix shell.
