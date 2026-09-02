# System Patterns — angular-state-example

## Repo-wide conventions

- **Standalone components only**, no NgModules.
- Lazy-loaded features: `app.routes.ts` → `loadChildren` → `features/<name>/<name>.routes.ts`
  returning a `Routes` array (e.g. `TODO_ROUTE`, `USER_ROUTE`, `INVOICE_ROUTE`,
  `CVA_ROUTE`, `DYNFORM_ROUTE`, `HOME_ROUTE`).
- Folder skeleton per feature: `pages/`, `components/`, `services/` (state /
  facade / repository), `models/`, sometimes `store/` or `utils/`.
- **Layering**: `*-repository.service.ts` (or `*-mock-repository.service.ts`) is
  the data boundary; state/facade/store services depend on it; components depend
  only on the state layer, never on a repository directly.
- Public reactive state exposed as read-only `computed()` (or SignalStore
  signals); writes only via named methods (`setFilters`, `setQuery`, `addTodo`…).
- Data layers are in-memory arrays returning `of(...).pipe(delay(...))` to fake a
  backend; `invoice` mock also emits `throwError` paths.
- Zone-based change detection is still on (`provideZoneChangeDetection({ eventCoalescing: true })`
  in `app.config.ts`); zone.js is still a dependency. Not zoneless.

## Pattern catalogue (one per feature)

### `features/todo` — NgRx SignalStore (the "official" reference)
- `store/todo.store.ts`: `signalStore(withState, withComputed, withMethods)`.
- Async via `rxMethod` + `tapResponse` (`@ngrx/signals/rxjs-interop`, `@ngrx/operators`).
- `loadByQuery`: `debounceTime(300)` → `distinctUntilChanged` → `switchMap` → `tapResponse`.
- CRUD methods call `TodoService` and `patchState` optimistically.
- State shape: `{ todos, isLoading, error, filter: { query, order } }`.

### `features/user` — two parallel implementations of search+pagination
- `user-search-state.service.ts`: hand-rolled `signal` state + a constructor
  `effect()` that calls `loadData()` whenever the search-params signal changes;
  loading/error managed by hand. `itemsPerPage = 5`.
- `user-search-rx-resource-state.service.ts`: same use case via `rxResource`
  (`params` = search-params signal, `stream` = repo call); the resource owns
  `value`/`isLoading`/`error`. Exposes `users = resource.value()` etc.
- Both expose identical public API: `users`, `loading`, `error`, `query`, `page`
  + `setFilters`, `setQuery` (resets page to 1), `setPage`.
- `user-detail-state.service.ts`: single-entity `signal<User | null>`.
- `user-repository.service.ts`: `providedIn: 'root'`, 50 hard-coded users.
- ⚠️ When touching user search, decide whether the change belongs in one or both
  search services.

### `features/invoice` — facade pattern
- `invoice-state.service.ts`: pure UI/query state as individual `signal`s
  (`page`, `pageSize`, `q`, `status`, `year`, `selectedId`); **URL-backed** —
  reads `queryParamMap` on construct, an `effect()` writes params back with
  `router.navigate(..., { queryParamsHandling: 'merge', replaceUrl: true })`.
- `invoice-facade.service.ts`: composes that state with two `rxResource`s
  (`listRes`, `detailRes`) over `InvoiceMockRepositoryService`; exposes
  `create` / `update` / `remove` which `.subscribe()` then `listRes.reload()` /
  `detailRes.reload()`.
- Components inject only `InvoiceFacadeService`.

### `features/cva` — signal-based ControlValueAccessor
- `components/amount-cva/amount-cva.component.ts`, wraps PrimeNG `p-inputNumber`.
- Registers itself: `if (this.ngControl) this.ngControl.valueAccessor = this`
  (injected with `{ self: true, optional: true }`) to avoid NG0200.
- Tracks `NgControl` `statusChanges` / `valueChanges` via
  `takeUntilDestroyed(destroyRef)` into signals ("pulses"), never binds the
  control to the template directly.
- `ngDoCheck` catches state changes that emit no event
  (`markAsTouched({emitEvent:false})`, `reset()`) by diffing `touched` / `pristine`.
- Computes `dirty` / `touched` / `submitted` / `isInvalid` (`showError`) from
  those signals. `submitted` fed by `NgForm.ngSubmit` and `FormGroupDirective.ngSubmit`.

### `features/dynform` — dynamic forms (Formly + PrimeNG)
- `@ngx-formly/core` + `@ngx-formly/primeng`.
- Custom field type `repeat-table` (`components/repeat-table-type/`), custom
  wrapper `panel` (`components/panel-field-wrapper/`) — both registered globally
  in `app.config.ts` via `provideFormlyCore([...withFormlyPrimeNG(), {...}])`,
  NOT per feature.
- `utils/FormlyFieldWithLogic.ts`: extends `FormlyFieldConfig` with
  `x-jsonLogic-visibility` / `x-jsonLogic-validator`; `json-logic-js` rules drive
  conditional visibility/validation declaratively instead of imperative code.

### `features/home` — landing page only, no state pattern.

## Styling (coexisting intentionally)

- PrimeNG: custom preset `CustomPreset` in `app.config.ts` = `definePreset(Lara, …)`
  remapping semantic `primary` onto the `gray` palette; `cssLayer` order
  `theme, base, primeng`.
- Tailwind v4 via `@tailwindcss/postcss` (`.postcssrc.json`), no `tailwind.config.js`;
  `src/tailwind.css` `@import`s `tailwindcss` + `tailwindcss-primeui`, pulled in by
  `src/styles.scss`. Plus `primeicons`.

## Related

- [[techContext]] — versions & commands
- [[activeContext]] — current work
