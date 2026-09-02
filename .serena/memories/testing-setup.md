# Testing setup (Jest)

Since 2026-09-02 (commit `3bfa245`) the project runs unit tests on **Jest**, not
Karma/Jasmine. See `.memory-bank/angular-state-example/decisions.md` #10 for the
rationale; this memory only records the non-obvious gotchas.

## Running
- `npm test` / `npx jest` — single run (no watch by default).
- `npx jest <fragment>` takes a **filename regex**, not a glob (e.g.
  `npx jest todo.store`, not `--include='**/todo.store.spec.ts'`).
- Tests run on **any Node**, headless, no browser / no `CHROME_BIN`.
  `ng build` still wants Node 22.23.2 — prepend `~/.nvm/versions/node/v22.23.2/bin`
  to PATH in this environment (system default is 22.14.0).

## Config files
- `jest.config.js` — spreads `createCjsPreset()` from `jest-preset-angular/presets`,
  adds `setupFilesAfterEnv: ['<rootDir>/setup-jest.ts']`.
- `setup-jest.ts` — **must call `setupZoneTestEnv()`** explicitly (imported from
  `jest-preset-angular/setup-env/zone`). In v17 a bare `import` no longer
  self-initialises → error "Need to call TestBed.initTestEnvironment() first".
- `tsconfig.spec.json` — `module: CommonJS`, `moduleResolution: node`,
  `types: [jest, node]`, includes `setup-jest.ts`.
- `angular.json` has **no `test` target** — `ng test` does not work. (Since
  2026-09-02 the build is on `@angular/build`, so the available runner would be
  `@angular/build:unit-test` / Vitest — not adopted; Jest stays.)

## Writing specs
- ts-jest runs transpile-only (`isolatedModules: true` in base tsconfig) → **type
  errors in specs do NOT fail the run**. Check types with `ng build` / editor.
- There is no global test module: every component/service spec must provide its
  own deps. Common needs in this repo:
  - `provideRouter([])` makes `ActivatedRoute` injectable (Home, UserDetailPage,
    UserSearchListPage, InvoicePage specs).
  - Route-scoped `@Injectable()` services (not `providedIn: 'root'`) must be listed
    in `providers`: `InvoiceStateService`, `InvoiceFacadeService`,
    `UserDetailStateService`, `UserSearchStateService`,
    `UserSearchRxResourceStateService`.
  - `UserDetailPageComponent` template needs a loaded user (`[formGroup]` built in
    an `effect()`) → its spec stubs `ActivatedRoute` with `{ id: '1' }`.
  - Formly specs need the full `provideFormlyCore([...withFormlyPrimeNG(), {...}])`
    config in `TestBed` `providers`. Since 2026-09-02 the app registers this on the
    `dynform` **route** (`dynform.routes.ts`), not in `app.config.ts` (bundle-size
    fix, decisions.md #12) — specs still declare their own copy, unchanged.
    `form-one.component.spec.ts` is the template to copy.
- NgRx SignalStore specs: provide `TodoStore` in `providers`, mock `TodoService`
  with `jest.fn()`, use `fakeAsync` + `tick(300)` for the `debounceTime(300)` in
  `loadByQuery` (see `todo/store/todo.store.spec.ts`).

## e2e (separate from Jest)
- Playwright (`@playwright/test`), one smoke spec: `e2e/dynform.e2e.ts`.
  `npm run e2e` (starts its own `ng serve`). Config: `playwright.config.ts`
  (`testMatch: **/*.e2e.ts`). Jest ignores `e2e/` (`testPathIgnorePatterns`).
- Needs `npx playwright install chromium` once (browsers in `~/.cache/ms-playwright`).
- Not a broad suite — see `.memory-bank/.../decisions.md` #14.

## Leftovers
- `@angular-devkit/build-angular` (and its webpack + `karma-source-map-support`
  deps) was removed 2026-09-02 — build is now `@angular/build`. `node_modules`
  no longer has karma/webpack. `decisions.md` #13.
- From-scratch `npm install` needs `--legacy-peer-deps` once (`@angular/build`
  optional peers); `npm ci` is clean. See memory-bank `techContext`.
