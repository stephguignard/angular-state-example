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
- `angular.json` has **no `test` target** — `ng test` does not work.

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
    config mirrored from `app.config.ts`.
- NgRx SignalStore specs: provide `TodoStore` in `providers`, mock `TodoService`
  with `jest.fn()`, use `fakeAsync` + `tick(300)` for the `debounceTime(300)` in
  `loadByQuery` (see `todo/store/todo.store.spec.ts`).

## Leftovers
- `karma` / `karma-source-map-support` may still be under `node_modules/` — they
  are auto-installed **optional peer deps** of `@angular-devkit/build-angular`,
  not project deps, unused. Dropping them entirely would mean moving the build to
  `@angular/build`.
