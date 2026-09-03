# Task completion checklist

No lint/format step exists. When a coding task is done, run:

1. **`npx jest`** — full unit run must pass. Run a subset while iterating
   (`npx jest <filename-fragment>`), full run before declaring done.
2. **`ng build`** — the real type check. ts-jest runs transpile-only
   (`isolatedModules`), so **type errors in specs/app do NOT fail Jest** — only
   `ng build` (or the editor/`strictTemplates`) catches them. Requires Node 22.23.2.
3. If touching `dynform` route-level Formly wiring or the smoke path:
   **`npm run e2e`** (`e2e/dynform.e2e.ts`; needs `npx playwright install chromium` once).

No type-check-only command — `ng build` is it. No formatter to run.

## Docs / memory-bank
Structural or pattern decisions → record in
`.memory-bank/angular-state-example/decisions.md` + `journal.md` (newest first),
rewrite `activeContext.md` / `progress.md`. The `bye` skill does this at session end.
Keep `CLAUDE.md` consistent with any change.
