# Decisions — angular-state-example

Lightweight decision log (ADR-style). Each entry: **Context → Decision →
Consequences**, plus a status. Newest at the bottom; never rewrite history —
supersede with a new entry.

Statuses: `accepted` · `superseded by #N` · `proposed`

---

## 1. The repo is a side-by-side comparison of state-management patterns
_Status: accepted (foundational)_

**Context.** Angular has many valid ways to hold reactive state and wire forms.
Isolated docs don't show the trade-offs.

**Decision.** One pattern per feature folder under `src/app/features/`, each
implementing (a slice of) the same use cases. Divergence between features is the
product, not tech debt. Do not "harmonise" a feature toward another.

**Consequences.** Inconsistency across features is expected and reviewed as
correct. New work = new pattern folder, not refactoring existing ones. See
[[systemPatterns]] for the catalogue.

---

## 2. Data layers are in-memory mocks
_Status: accepted_

**Context.** The point is state/form patterns, not backend integration.

**Decision.** Every `*-repository.service.ts` is a hard-coded array returning
`of(...).pipe(delay(...))`; the invoice mock also exercises `throwError`.

**Consequences.** No HTTP, no interceptors, no real error taxonomy. Error state
is a simple string. Tests never need HTTP mocking.

---

## 3. Styling: PrimeNG + Tailwind v4 coexist, Tailwind is CSS-first
_Status: accepted_

**Context.** PrimeNG components are themed via a preset; utility classes are also
wanted. Tailwind v4 dropped the JS config in favour of CSS.

**Decision.** PrimeNG custom preset `CustomPreset` (`definePreset(Lara, …)`,
`primary`→`gray`) in `app.config.ts`; Tailwind v4 via `@tailwindcss/postcss`,
no `tailwind.config.js`, entrypoint `src/tailwind.css` (`@import "tailwindcss"`
+ `tailwindcss-primeui`) pulled by `src/styles.scss`. `cssLayer` order
`theme, base, primeng`.

**Consequences.** Two styling systems in play — intentional. ⚠️ `@use "tailwindcss"`
must NOT appear in component `.scss` (it inlines Tailwind per-component — this is
why `home-page.component.scss` blows the `anyComponentStyle` budget). See
[[progress]].

---

## 4. Zone-based change detection retained
_Status: accepted_

**Context.** Angular 21 makes zoneless viable.

**Decision.** Keep `provideZoneChangeDetection({ eventCoalescing: true })`;
zone.js stays a dependency.

**Consequences.** Patterns are demonstrated in the still-most-common setup.
Revisit if a feature specifically wants to demo zoneless.

---

## 5. `.mcp.json` is git-ignored
_Status: accepted (2026-09-02)_

**Context.** Project-scoped MCP config for `memory-bank` + `serena`. The commands
need absolute paths: the repo path (`--project`, `MEMORY_BANK_ROOT`) and an nvm
Node path for `npx` (bare `npx` isn't on the MCP servers' PATH).

**Decision.** Add `/.mcp.json` to `.gitignore`; keep it local only.

**Consequences.** Each machine recreates its own `.mcp.json`. The memory bank
(`techContext`) documents the intended server setup so it can be reproduced.
`.serena/project.yml` *is* committed (no machine-specific paths in it).

---

## 6. Serena installed from PyPI, not the git repo
_Status: accepted (2026-09-02)_

**Context.** Serena's docs favour `uvx --from git+https://github.com/oraios/serena`.
In this environment `git fetch` of a pinned commit fails (no GitHub auth,
terminal prompts disabled).

**Decision.** Use `uvx --from serena-agent` (PyPI).

**Consequences.** May trail `main` slightly. Switch back to the git source if a
newer feature is needed and the environment allows it.

---

## 7. Serena LSP backend = `typescript`
_Status: proposed (2026-09-02) — pending confirmation_

**Context.** Serena auto-generated `.serena/project.yml` with
`language_servers: [typescript]`. For Angular it recommends the `angular` backend
(covers templates + TS) but that needs `@angular/language-server`, not installed.

**Decision (tentative).** Keep `typescript` — works with zero extra setup.

**Consequences.** Serena won't resolve symbols inside HTML templates. If template
navigation matters, `npm i -D @angular/language-server` and set the backend to
`angular`, then supersede this entry.

---

## 8. Memory bank + this decision log are committed
_Status: accepted (2026-09-02)_

**Context.** The Cline memory-bank pattern is meant to be shared project context.

**Decision.** Commit `.memory-bank/angular-state-example/**` and keep it current
each work session (see [[journal]]); `activeContext` / `progress` are rewritten,
`journal` / `decisions` are append-only.

**Consequences.** Memory bank drift is a review concern like stale docs. Keep it
consistent with `CLAUDE.md`.

---

## 9. Session lifecycle via `/hello` and `/bye` slash commands
_Status: accepted (2026-09-02)_

**Context.** The memory bank only helps if it's actually read at the start and
updated at the end of each work session. That needs a repeatable routine.

**Decision.** Two project slash commands in `.claude/commands/`:
`/hello` loads the memory bank + Serena memory and prints a short status recap
(read-only); `/bye` rewrites `activeContext` / `progress`, appends a `journal`
entry, records decisions here, and updates Serena memories, then asks before
committing.

**Consequences.** The routine is versioned and shared. `/bye` degrades to
files-only when the `serena` / `memory-bank` MCP servers aren't connected.
`.claude/settings.local.json` (which enables those servers) is git-ignored
globally, so each machine approves them once.

---

## 10. Unit tests run on Jest (`jest-preset-angular`), not Karma
_Status: accepted (2026-09-02) — supersedes the Karma/Jasmine setup_

**Context.** The repo shipped the CLI-default Karma + Jasmine runner, which needs
a real (or headless) browser and a `CHROME_BIN` wrapper to run in this
environment. Angular 21 also ships an experimental `@angular/build:unit-test`
builder (primarily Vitest; Jest runner support is new/limited).

**Decision.** Migrate to **Jest 30 + `jest-preset-angular` 17** (jsdom, zone
setup via `setup-jest.ts` → `setupZoneTestEnv()`). Config in `jest.config.js`
(spreads `createCjsPreset()`); `tsconfig.spec.json` switched to
`module: CommonJS` / `types: [jest, node]`. The `test` target is removed from
`angular.json`; `npm test` runs `jest` directly. Karma/Jasmine packages
uninstalled. Not the `@angular/build:unit-test` builder — too new to rely on.

**Consequences.** Tests run headless on any Node, no browser. `ng test` no
longer works — use `npm test` / `npx jest`. Spec matching is a filename regex,
not a glob. Jasmine globals (`jasmine.createSpyObj`, `spyOn`) are gone; use
`jest.fn()` / `jest.spyOn()` in new specs. Component specs must supply their own
providers (`provideRouter([])`, route-scoped `@Injectable()` services) since
there's no global test module. `karma` may still be pulled transitively as an
optional peer of `@angular-devkit/build-angular` — harmless.
