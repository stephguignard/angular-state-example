# Progress — angular-state-example

_Last updated: 2026-09-02 (scss + bundle budgets fixed; build → @angular/build)_

## Build / test status

- Build tooling: **`@angular/build`** (`@angular-devkit/build-angular` removed,
  [[decisions]] #13). `ng build` / `ng serve` unchanged in behaviour (same esbuild
  `application` builder). Angular framework bumped `21.2.20 → 21.2.22` to align
  peers. Verified 2026-09-02: prod build, dev build, `ng serve` (200 on `/` and
  `/main.js`), `npm test` 37/37 — all green.
- `ng build` (production, = default config): **PASSES** as of 2026-09-02
  (all on `main`, `7befc84`). Only non-fatal warnings remain:
  - ~~`✘ initial bundle 1.27 MB` > 1 MB error budget~~ **FIXED** — moved
    `provideFormlyCore([...withFormlyPrimeNG(), {...}])` out of `app.config.ts`
    into the `dynform` route's `providers` ([[decisions]] #12). Initial bundle
    **1.27 MB → 672 kB raw / 278 kB → 162 kB transfer**. The 500 kB
    `maximumWarning` still fires (⚠ only, build succeeds); bump it in
    `angular.json` if a fully-silent build is wanted.
  - ~~`home-page.component.scss` `anyComponentStyle` budget~~ **FIXED**
    (`fix/prod-build-budgets`): removed `@use "tailwindcss";` + the `.card-selection`
    `@apply` class from the component scss; moved those utilities inline onto the
    `<p-card>` tags in `home-page.component.html`. The scss now holds only plain
    `.p-card` CSS. Tailwind is once again global-only (`src/tailwind.css`).
  - Non-blocking warning: `json-logic-js` is CommonJS, not ESM
    (optimization bailout) in `form-one.component.ts`.
  - `ng build --configuration development` builds clean (no budgets).
- `npm test` (= `jest`, run 2026-09-02, Node 22.23.2): **25 suites / 37 tests,
  all green.** Test stack migrated Karma/Jasmine → **Jest** (`jest-preset-angular`
  17, jsdom, zone setup via `setup-jest.ts`). See [[decisions]] #10.
  - Added `todo/store/todo.store.spec.ts` — the SignalStore had no spec. 13 tests:
    initial state, computed (`todosCount` / `sortedTodos` / `hasError`),
    `updateQuery` / `updateOrder`, `loadByQuery` (fakeAsync + `tick(300)` for the
    debounce, `distinctUntilChanged`), `addTodo` / `removeTodo` / `toggleTodo`
    (incl. error branches), with `TodoService` mocked via `jest.fn()`.
  - Every other feature already had at least a "should create" spec per unit;
    `FormlyFieldWithLogic.ts` is a pure type (no runtime → no spec).
  - The previously-red 12 CLI-scaffold stubs were fixed in the same pass by
    giving each `TestBed` what the unit needs: `provideRouter([])` for
    `ActivatedRoute` (HomePage, UserDetailPage, UserSearchListPage, InvoicePage),
    the route-scoped `@Injectable()` state services as explicit `providers`
    (`InvoiceStateService`, `InvoiceFacadeService`, `UserDetailStateService`,
    `UserSearchStateService`, `UserSearchRxResourceStateService`), the full
    Formly config for `FormOne`, and a stub `ActivatedRoute` with `id: '1'` for
    `UserDetailPage` (its template needs a loaded user to build `userForm`).
  - Jest runs on any Node with no browser / `CHROME_BIN` — the old Karma Chromium
    setup is gone. Node 22.23.2 still preferred (`.nvmrc`), but not required for tests.
- **Branch state:** `feature/cva` fast-forward-merged into `main` then deleted
  (2026-09-02). `main` (`c5a8dac`) == `origin/main` is the only branch — Angular 21
  with everything. See [[activeContext]] for the discarded stale local `main` commit.

## Feature status

| Feature | Pattern | State |
|---|---|---|
| `todo` | NgRx SignalStore + `rxMethod`/`tapResponse` | Complete, the reference impl |
| `user` | hand-rolled signals + `effect()` **and** `rxResource`, in parallel | Both complete; keep them in sync when changing the shared use case |
| `user` (detail) | single `signal<User\|null>` state service | Complete |
| `invoice` | facade + `rxResource` + URL-backed query state | Complete |
| `dynform` | Formly + PrimeNG, custom `repeat-table` type, `panel` wrapper, json-logic rules | Working; `form-one` is the demo page, has seen recent edits |
| `cva` | signal-based `ControlValueAccessor` over PrimeNG inputNumber | Working; most recently iterated feature (the deleted `feature/cva` branch) |
| `home` | landing page | Complete |

## Known issues / rough edges

- Most unit specs are still only "should create" smoke tests (green). `todo.store`
  now has real behavioural coverage; the other patterns (user search services,
  invoice facade, cva) would benefit from the same treatment.
- ~~`karma` / webpack pulled transitively by `@angular-devkit/build-angular`~~
  **resolved** — migrated to `@angular/build` ([[decisions]] #13); no webpack /
  `@ngtools` / `karma-source-map-support` in `node_modules` anymore.
- `npm install` from scratch needs `--legacy-peer-deps` once (`@angular/build`
  optional peers) — see [[techContext]] "Dependency install gotcha".
- `user-search-rx-resource-state.service.ts` has a `clearError()` stub that does
  nothing (resource owns the error) — intentional, left as a comparison note.
- `todo.store.ts` `addTodo` uses `Date.now()` as id and pushes optimistically.
- `context7` MCP server fails to connect (bare `npx` not on PATH).

## What's left (if the project were to continue)

- Optionally add an `angular` LSP backend for Serena ([[decisions]] #7).
- Deepen the specs beyond "should create" for the non-`todo` patterns.
- `@angular/platform-browser-dynamic` is now flagged deprecated by npm (use
  `@angular/platform-browser`) — still listed in deps; harmless, could be dropped.
- No functional feature work is pending — the repo is "done" as a reference; new
  work = new pattern folders.

## Related

- [[activeContext]] · [[systemPatterns]] · [[projectbrief]] · [[journal]] · [[decisions]]
