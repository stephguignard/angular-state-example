# Progress — angular-state-example

_Last updated: 2026-09-02_

## Build / test status

- `ng build` (production, = default config): **FAILS on budget errors only**
  (compilation + bundling succeed). Run 2026-09-02:
  - `✘ initial bundle 1.27 MB` > 1 MB error budget (PrimeNG + Tailwind + Formly).
  - `✘ home-page.component.scss 19.33 kB` > 8 kB `anyComponentStyle` budget —
    **root cause: `@use "tailwindcss";` inside the component scss** (305 B of
    source) inlines Tailwind per-component. Tailwind belongs only in the global
    `src/tailwind.css`; this `@use` should be removed.
  - Also a non-blocking warning: `json-logic-js` is CommonJS, not ESM
    (optimization bailout) in `form-one.component.ts`.
  - `ng build --configuration development` builds clean (no budgets).
  - Fixes if desired: drop the `@use "tailwindcss"` line in
    `home-page.component.scss`; bump the `initial` budget in `angular.json`
    (or accept it — it's a demo). Not done (not requested).
- `ng test` (run 2026-09-02, Node 22.23.2, headless Chromium): **TOTAL 12 SUCCESS,
  12 FAILED — 24 specs.**
  - The 12 failures are all **pre-existing CLI-scaffold stubs** that never provided
    the deps the unit needs — NG0201 "No provider found for …":
    `ActivatedRoute` (HomePage, UserDetailPage, UserSearchListPage, UserSearch,
    UserTable, FormOne), route-scoped state services (`InvoiceStateService`,
    `InvoiceFacadeService`, `UserDetailStateService`, `UserSearchStateService`,
    `UserSearchRxResourceStateService` — all `@Injectable()` without
    `providedIn: 'root'`, provided at route/component level in real use),
    `InvoicePageComponent`.
  - Not regressions from the Angular 21 upgrade or the tooling work — the default
    `TestBed.configureTestingModule({})` stubs were simply never fleshed out.
  - The 12 passing: `TodoStore`, `TodoService`, `TodoComponent`,
    `TodoDetailPage`, `TodoSearchListPage`, `AmountCvaComponent`, `CvaPage`,
    `PanelFieldWrapper`, `RepeatTableType`, `UserRepositoryService`,
    `InvoiceRepositoryService` / `InvoiceMockRepositoryService`, `AppComponent`.
- Running Karma here needs `CHROME_BIN` pointing at a `--no-sandbox` Chromium
  wrapper and the pinned Node (22.23.2); the system shell defaults to Node 22.14.0
  which trips an `ERR_ASSERTION` in the karma builder with `--include`.

## Feature status

| Feature | Pattern | State |
|---|---|---|
| `todo` | NgRx SignalStore + `rxMethod`/`tapResponse` | Complete, the reference impl |
| `user` | hand-rolled signals + `effect()` **and** `rxResource`, in parallel | Both complete; keep them in sync when changing the shared use case |
| `user` (detail) | single `signal<User\|null>` state service | Complete |
| `invoice` | facade + `rxResource` + URL-backed query state | Complete |
| `dynform` | Formly + PrimeNG, custom `repeat-table` type, `panel` wrapper, json-logic rules | Working; `form-one` is the demo page, has seen recent edits |
| `cva` | signal-based `ControlValueAccessor` over PrimeNG inputNumber | Working; the branch's namesake, most recently iterated |
| `home` | landing page | Complete |

## Known issues / rough edges

- `main` branch is stale (Angular 19). All real work is on `feature/cva`.
- Half the unit specs are red (see above) — untouched CLI stubs missing providers.
  Fixing them = adding `provideRouter([])` / providing the route-scoped services
  in each `TestBed`. Low value for a reference repo; left as-is intentionally.
- `user-search-rx-resource-state.service.ts` has a `clearError()` stub that does
  nothing (resource owns the error) — intentional, left as a comparison note.
- `todo.store.ts` `addTodo` uses `Date.now()` as id and pushes optimistically.
- `context7` MCP server fails to connect (bare `npx` not on PATH).

## What's left (if the project were to continue)

- Decide git tracking for `.mcp.json` / `.serena/` / `.memory-bank/`.
- Optionally add an `angular` LSP backend for Serena.
- No functional feature work is pending — the repo is "done" as a reference; new
  work = new pattern folders.

## Related

- [[activeContext]] · [[systemPatterns]] · [[projectbrief]] · [[journal]] · [[decisions]]
