# Core — angular-state-example

Playground/reference repo: compare Angular **state-management** and **form-integration**
patterns side by side, one per folder under `src/app/features/`. Divergence between
features is **intentional** — extend a feature in its own pattern, do not homogenise.

## Source map
- `src/app/app.routes.ts` — root routes; every feature lazy-loaded via
  `loadChildren: () => import('./features/<n>/<n>.routes').then(r => r.<N>_ROUTE)`.
  `home` included (landing page, no state pattern). `**` → `/home`.
- `src/app/app.config.ts` — providers; custom PrimeNG `CustomPreset` (Lara + `definePreset`,
  `primary` remapped onto `gray`). Formly is **NOT** registered here.
- `src/app/core/`, `src/app/shared/` — exist but **empty** today.
- `src/app/features/<name>/` skeleton: `<name>.routes.ts`, `pages/`, `components/`,
  `services/`, `models/`.

## Feature = pattern (the point of the repo)
- `todo` — NgRx Signals `signalStore` (`store/todo.store.ts`): `withState`/`withComputed`/
  `withMethods`, `rxMethod`+`tapResponse`. The "official NgRx Signals" reference.
- `user` — **two parallel impls** of one search/pagination use case:
  `user-search-state.service.ts` (hand-rolled signals + `effect()`) vs
  `user-search-rx-resource-state.service.ts` (`rxResource`). Plus
  `user-detail-state.service.ts` + `user-repository.service.ts`. A search change may
  belong in both services.
- `invoice` — facade: `invoice-state.service.ts` (pure UI/query state) +
  `invoice-facade.service.ts` (`rxResource` over `invoice-mock-repository.service.ts`).
  Components depend on the facade only.
- `dynform` — `@ngx-formly/core` + `@ngx-formly/primeng`; custom `repeat-table-type`,
  `panel-field-wrapper`, `utils/FormlyFieldWithLogic.ts` (json-logic-js rules).
  Formly config registered in the **dynform route's `providers`** (`dynform.routes.ts`),
  not globally — keeps Formly out of the initial bundle. New field types/wrappers go there.
- `cva` — signal-based `ControlValueAccessor` (`amount-cva.component.ts`): tracks `NgControl`
  status/value via `takeUntilDestroyed` subs → signals; `ngDoCheck` for silent state changes.

## Focused memories
- Tooling/deps: `mem:tech_stack`
- Commands to run: `mem:suggested_commands`
- Code style & patterns: `mem:conventions`
- Definition of done: `mem:task_completion`
- Unit/e2e testing gotchas (Jest, no global TestBed): `mem:testing-setup`

## Non-code project context
Long-form context in `.memory-bank/angular-state-example/` (Cline memory-bank:
`projectbrief`, `productContext`, `systemPatterns`, `techContext`, `activeContext`,
`progress`, append-only `journal.md`, ADR `decisions.md`). Read at session start,
update `activeContext`/`progress` + add `journal` entry at session end. `hello`/`bye`
skills automate this.
