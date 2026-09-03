# Conventions

## TypeScript / style
- Single quotes, 2-space indent (`.editorconfig`).
- `tsconfig.json` strict: `strict`, `strictTemplates`, `strictInjectionParameters`,
  `strictInputAccessModifiers`, `noPropertyAccessFromIndexSignature`.
  **Do not widen types to silence errors** — respect the strictness.
  `noPropertyAccessFromIndexSignature` → use bracket access for index signatures.
- Some comments / console messages are in **French**. Match the existing style
  within a file; do not translate wholesale.

## Angular patterns
- **Standalone components only.** No NgModules.
- Feature routing: `*.routes.ts` exports a `Routes` array (`<NAME>_ROUTE`), consumed
  via `loadChildren` in `app.routes.ts`. Not `loadComponent` lists.
- **Public reactive state = read-only `computed()` signals.** Never expose a
  `WritableSignal`. Mutation only via named methods (`setFilters`, `setQuery`,
  `addTodo`, …) on the service/store.
- **Repository services** (`*-repository.service.ts`) are the HTTP/data boundary.
  State/facade services depend on them; components never inject a repository directly.
- Route-scoped services use bare `@Injectable()` (not `providedIn: 'root'`) — must be
  listed in a route's / test's `providers`.

## Formly (dynform only)
- Register field types/wrappers/validation config in the **`dynform` route's
  `provideFormlyCore([...])`** (`dynform.routes.ts`), never in `app.config.ts`.
- Specs rendering a Formly form declare their own
  `provideFormlyCore([...withFormlyPrimeNG(), {...}])` in TestBed (no global test config).

## Commits — Conventional Commits (enforced)
Full ruleset: `.claude/rules/conventional-commits.md`. Summary:
- `<type>(<scope>): <description>` — imperative, lowercase, no trailing period, ≤72.
- Types: `feat` (**never `feature`**), `fix`, `docs`, `refactor`, `test`, `build`,
  `chore`, `perf`, `style`, `ci`, `revert`.
- Scopes: feature folders (`todo`, `user`, `invoice`, `dynform`, `cva`, `home`) or
  `memory-bank`, `deps`, `config`, `tooling`, `theming`, `formly`.
- Breaking: `!` after type/scope and/or `BREAKING CHANGE:` footer.
- **Never commit/push without explicit user request.** Branch off `main` first.
- Attribution footers per current harness session instructions.
