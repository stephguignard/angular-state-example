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
must NOT appear in component `.scss` (it inlines Tailwind per-component). This once
blew `home-page.component.scss` past the `anyComponentStyle` budget — fixed
2026-09-02 by moving the utilities inline into the template (`fix/prod-build-budgets`);
use `class="…"` utilities in the template, not `@apply` in component scss. See
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

---

## 11. Conventional Commits, enforced by convention (no tooling)
_Status: accepted (2026-09-02)_

**Context.** Commit history was inconsistent (`feature:`, `chore:`, bare
subjects). The repo deliberately has no lint/hook tooling ([[techContext]] "Not
present"), so a commitlint + husky setup would be the first such addition.

**Decision.** Adopt Conventional Commits 1.0.0, documented as a rules file at
`.claude/rules/conventional-commits.md` and referenced from `CLAUDE.md`
("Commit conventions"). No `commitlint` / `husky` — the rule is followed by
authors and by Claude Code reading the rules file, not machine-enforced. Use
`feat` (not `feature`); scope is usually a feature folder or `memory-bank` /
`deps`.

**Consequences.** `.claude/rules/` is a new committed location for agent-facing
rules (loaded via the `CLAUDE.md` reference, not auto-discovered). Old commits
keep their non-conforming messages — history is not rewritten. If drift returns,
revisit and add `commitlint` (would supersede this entry).

---

## 12. Formly config lives on the `dynform` route, not in `app.config.ts`
_Status: accepted (2026-09-02) — revises the "register once globally" guidance_

**Context.** `provideFormlyCore([...withFormlyPrimeNG(), {...}])` sat in
`app.config.ts`, so `@ngx-formly/core` + `@ngx-formly/primeng` and the PrimeNG
field components it wires (input, textarea, radio, checkbox, **select** — the
last pulls overlay/scroller) were all in the **initial** bundle. `dynform` is the
only feature that uses Formly. Initial bundle was 1.27 MB raw / 278 kB transfer —
over the 1 MB `maximumError` budget in `angular.json`.

**Decision.** Move the whole `provideFormlyCore([...])` call into the `dynform`
route's `providers` (`dynform.routes.ts`). Route-level env providers are visible
to the lazily-loaded `FormOneComponent`; the config is scoped to `/dynform`.
`app.config.ts` keeps only router / http / PrimeNG theme. Also dropped the unused
`FormlyDatepickerModule` import there.

**Consequences.** Initial bundle → **672 kB raw / 162 kB transfer**; `ng build`
prod passes (only the 500 kB `maximumWarning` remains, non-fatal). Formly + its
PrimeNG components now load with the `dynform` chunk. New Formly types/wrappers go
in `dynform.routes.ts`, not `app.config.ts` — [[systemPatterns]] and `CLAUDE.md`
updated. Component specs still declare their own `provideFormlyCore` in `TestBed`
(unchanged — no global test config). If a second feature ever needs Formly,
promote the call to a shared `provideFormly…()` helper or back to `app.config.ts`
and re-measure.

---

## 13. Build on `@angular/build`, not `@angular-devkit/build-angular`
_Status: accepted (2026-09-02)_

**Context.** The CLI-default `@angular-devkit/build-angular` pulls the whole
webpack toolchain (`webpack`, `webpack-dev-server`, `@ngtools/webpack`, babel
loaders, `mini-css-extract-plugin`, …) and `karma-source-map-support` as **hard
deps**, plus `karma` as an optional peer — none of it used: the project already
built with the esbuild `:application` builder and tests on Jest. `@angular/build`
is the same builders (`application` / `dev-server` / `extract-i18n`) without the
webpack/karma baggage.

**Decision.** Remove `@angular-devkit/build-angular`, add `@angular/build`, point
the three `angular.json` targets at `@angular/build:*`. Bump `@angular/*`
`21.2.20 → 21.2.22` and `@angular/cli` / `@angular/compiler-cli` to match so
`@angular/build`'s peers resolve. `@angular/cli` stays (owns the `ng` CLI and
schematics; does not depend on `build-angular`).

**Consequences.** `node_modules` loses webpack + `@ngtools` + `build-angular` +
`build-webpack`; `package-lock.json` ~7k lines smaller. `ng build` / `ng serve`
behave identically (same esbuild engine, same bundle output). `ng test` still
absent (would now be `@angular/build:unit-test`, Vitest — not adopted, [[decisions]]
#10 reasoning still holds). **Install gotcha:** a from-scratch `npm install` needs
`--legacy-peer-deps` once because npm tries to satisfy `@angular/build`'s optional
peers (`@angular/localize`, `ng-packagr`); `npm ci` and lockfile-based
`npm install` are clean. Documented in [[techContext]].

---

## 14. Playwright for a thin e2e smoke layer (not a broad suite)
_Status: accepted (2026-09-02)_

**Context.** Moving `provideFormlyCore` to the `dynform` route ([[decisions]] #12)
could only be checked by build + a unit spec that supplies its own config — the
"do route providers actually reach the lazy page" question had no automated
coverage, and no browser tooling was available in-session to eyeball it.

**Decision.** Add `@playwright/test` with **one** smoke spec, `e2e/dynform.e2e.ts`:
loads `/dynform`, asserts every Formly field type resolved to its PrimeNG
component + the custom `repeat-table` renders + the jsonLogic visibility rule
fires, with a clean console. `playwright.config.ts` runs its own `ng serve`;
specs are `*.e2e.ts` in `e2e/` so Jest (`*.spec.ts`, plus an `e2e/` ignore) never
touches them. `npm run e2e`. This is **not** a commitment to broad e2e — the repo
compares unit-level patterns; e2e stays a smoke check unless a feature needs more.

**Consequences.** New `e2e/` dir + `playwright.config.ts` + `e2e` script.
Browsers (`npx playwright install chromium`, ~650 MB) live in `~/.cache`, not the
repo; `test-results/` + `playwright-report/` git-ignored. [[techContext]] /
`CLAUDE.md` updated ("no e2e runner" → "thin smoke layer"). If e2e grows, split a
`playwright/` project config per area and revisit.
