# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

This is a playground/reference project (Angular 19, standalone components, no NgModules) whose sole point is to
compare different Angular **state management** and **form-integration** patterns side by side, one per feature
folder under `src/app/features/`. When asked to change or extend a feature, keep it consistent with the pattern
that feature already demonstrates rather than "fixing" it to match another feature — the divergence is intentional.

## Commands

- `npm start` / `ng serve` — dev server at `http://localhost:4200/`
- `ng build` — production build to `dist/`
- `ng test` — unit tests via Karma/Jasmine (watches by default)
- `ng test --no-watch --browsers=ChromeHeadless` — single run, useful for CI/agent verification
- `ng test --include='**/todo.store.spec.ts'` — run a single spec file (adjust the glob to target one file)
- `ng generate component features/<feature>/... ` — scaffolding follows Angular CLI schematics (style: scss, per `angular.json`)

There is no configured e2e runner, no lint script wired into `package.json`, and no Prettier/ESLint config present — don't assume `npm run lint` exists.

## Architecture

### Feature module layout

Each feature under `src/app/features/<name>/` follows the same skeleton and is lazy-loaded from `src/app/app.routes.ts`
via `loadChildren` pointing at a `<name>.routes.ts`:

```
features/<name>/
  <name>.routes.ts
  pages/<page>/<page>.component.{ts,html,scss,spec.ts}
  components/<component>/...
  services/            # state services, repositories, facades
  models/
```

### State-management patterns under comparison (the core of this repo)

- **`features/todo`** — NgRx Signals `signalStore` (`store/todo.store.ts`): `withState` + `withComputed` +
  `withMethods`, using `rxMethod`/`tapResponse` from `@ngrx/signals` and `@ngrx/operators` for async flows
  (debounce/switchMap search, CRUD via `TodoService`). This is the "official NgRx Signals" reference.
- **`features/user`** — has **two parallel implementations** of the same search/pagination use case, for direct
  comparison:
  - `user-search-state.service.ts`: hand-rolled signals + an `effect()` that re-triggers `loadData()` whenever the
    search-params signal changes, manually managing loading/error state.
  - `user-search-rx-resource-state.service.ts`: the same use case rebuilt with Angular's `rxResource` (from
    `@angular/core/rxjs-interop`), letting the resource own loading/error/value instead of hand-rolling it.
  - Also has `user-detail-state.service.ts` (single-entity state) and `user-repository.service.ts` (HTTP boundary).
  When touching user search, check whether the change belongs in one or both of these services.
- **`features/invoice`** — a **facade pattern**: `invoice-state.service.ts` holds pure UI/query state (page, filter,
  selected id), `invoice-facade.service.ts` composes that state with `rxResource` calls into the repository
  (`invoice-mock-repository.service.ts`) and exposes actions (`create`/`update`/`remove`) that reload the resources.
  Components depend only on the facade, never on state/repository directly.
- **`features/dynform`** — dynamic forms via `@ngx-formly/core` + `@ngx-formly/primeng`, including a custom field
  type (`repeat-table-type`) and a custom wrapper (`panel-field-wrapper`), plus `utils/FormlyFieldWithLogic.ts` which
  layers `json-logic-js` rules onto Formly field configs (conditional visibility/validation driven by JSON logic
  rather than imperative code).
- **`features/cva`** — `ControlValueAccessor` implementation (`amount-cva.component.ts`) built entirely on signals:
  tracks Angular's `NgControl` status/value via `takeUntilDestroyed`-scoped subscriptions that feed signals (not
  templates directly), computes `dirty`/`touched`/`invalid`/`submitted` from those signals, and uses `ngDoCheck` to
  catch control-state changes that don't emit events (e.g. `markAsTouched({emitEvent:false})`, `reset()`). This is
  the reference for "how to write a signal-based CVA that stays in sync with reactive-forms status."

### Formly + PrimeNG wiring

Formly's global config (validation messages, the `panel` wrapper, the `repeat-table` type) is registered once in
`app.config.ts` via `provideFormlyCore([...withFormlyPrimeNG(), {...}])`. New Formly field types/wrappers should be
registered there, not per-feature.

### PrimeNG theming

`app.config.ts` defines a custom PrimeNG preset (`CustomPreset`) by extending the `Lara` preset with
`definePreset`, remapping semantic `primary` colors onto the `gray` palette. Tailwind (`tailwindcss` +
`tailwindcss-primeui`) is also active (`src/tailwind.css`, `.postcssrc.json`) alongside PrimeNG components — both
styling systems coexist intentionally.

## Conventions observed in the code

- Standalone components only; feature routing files (`*.routes.ts`) return `Routes` arrays consumed via
  `loadChildren`, not `loadComponent`-per-route lists in `app.routes.ts`.
- Public reactive state is exposed as read-only `computed()` signals; mutation happens only through named methods
  on the service/store (`setFilters`, `setQuery`, `addTodo`, etc.) — never expose a `WritableSignal` publicly.
- Repository services (`*-repository.service.ts`) are the HTTP/data boundary; state/facade services depend on them,
  components never inject a repository directly.
- Single quotes, 2-space indentation (enforced by `.editorconfig`); TypeScript `strict` mode plus
  `strictTemplates`, `strictInjectionParameters`, and `noPropertyAccessFromIndexSignature` are on in `tsconfig.json`
  — respect these rather than widening types to silence errors.
- Some in-code comments and console messages are in French — match existing style within a file rather than
  translating wholesale.
