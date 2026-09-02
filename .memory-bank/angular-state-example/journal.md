# Dev Journal — angular-state-example

Dated work log, **newest entry first**. One entry per work session.
For the *why* behind structural choices, see [[decisions]].
For current state (not history), see [[activeContext]] and [[progress]].

Entry template:

```markdown
## YYYY-MM-DD — <short title>
**Done:** what was actually changed / shipped
**Decided:** choices made (link to [[decisions]] if structural)
**Observed:** surprises, failures, root causes found
**Next:** open threads to pick up later
```

---

## 2026-09-02 — Fix the initial-bundle budget (move Formly off app.config)
**Done:**
- Diagnosed the 1.27 MB initial bundle with `source-map-explorer`: PrimeNG ~513 kB,
  most of it dragged in eagerly by `withFormlyPrimeNG()` in `app.config.ts`
  (input/textarea/radio/checkbox/select field components).
- Moved the whole `provideFormlyCore([...withFormlyPrimeNG(), {...}])` call into
  the `dynform` route's `providers` (`dynform.routes.ts`). `app.config.ts` now
  only has router / http / PrimeNG theme; dropped the dead `FormlyDatepickerModule`
  import.
- Updated `CLAUDE.md` ("Formly + PrimeNG wiring"), `systemPatterns`, and added
  [[decisions]] #12.
- On branch `fix/home-scss-budget` (same branch as the scss fix).

**Decided:** [[decisions]] #12 — Formly config is route-scoped, not global. Revises
the old "register once in app.config.ts" rule. Rationale: `dynform` is the only
Formly consumer; no reason to tax every other route.

**Observed:**
- Initial bundle **1.27 MB → 672 kB raw**, **278 kB → 162 kB transfer**.
  `ng build` prod now **passes** (only the 500 kB `maximumWarning` left).
- `npm test` still 25 suites / 37 tests green — `FormOneComponent` spec already
  provides its own `provideFormlyCore` in `TestBed`, unaffected.
- Dev server: `/dynform` returns HTTP 200. No browser tooling available this
  session, so not visually confirmed — the FormOne spec's `detectChanges()` does
  render the full form (input/checkbox/select/repeat-table) and passes.

**Next:** push / merge `fix/home-scss-budget`. Optional: bump the 500 kB
`maximumWarning` in `angular.json` for a warning-free build; browser-check
`/dynform` when tooling is back.

---

## 2026-09-02 — Fix home-page scss budget
**Done:**
- `home-page.component.scss`: removed `@use "tailwindcss";` and the
  `.card-selection { @apply … }` class. File now holds only plain `.p-card` CSS.
- `home-page.component.html`: the 3 `class="card-selection"` on `<p-card>` replaced
  by the utilities inline (`w-[22rem] cursor-pointer transform transition
  duration-300 hover:scale-105 hover:shadow-lg`).
- Committed on branch `fix/home-scss-budget` off `main` (`0ef8614`).

**Decided:** template utilities over `@apply` in component scss — see [[decisions]]
#3 (updated). No new ADR.

**Observed:**
- `ng build` prod: the `anyComponentStyle` budget error on
  `home-page.component.scss` is gone. The `initial` bundle 1 MB budget still
  errors (269 kB over) — untouched, pre-existing, separate concern.
- `npx jest home-page` green (spec is just "should create").

**Next:** decide push/merge of `fix/home-scss-budget`. Optionally bump the
`initial` budget in `angular.json` for a fully-green prod build.

---

## 2026-09-02 — Delete feature/cva + session close
**Done:**
- Deleted `feature/cva` local + remote (`git branch -d` accepted — fully merged).
  `main` (`c5a8dac`) is the only branch. Recorded in `activeContext` (`c5a8dac`).
- `/bye` pass: reconciled `activeContext` / `progress` with the post-merge,
  single-branch reality; trimmed stale "what's left" items (git-tracking
  decisions already made).
- Re-ran `npm test` → 25 suites / 37 tests green (no code changed since last run).

**Decided:** nothing new structural.

**Observed:** the "decide keep/delete feature/cva" thread from the previous entry
is now closed — deleted.

**Next:** open threads unchanged — deeper specs for non-`todo` patterns; optional
`@angular/build` migration to drop the `karma` peer; optional Serena `angular` LSP.

---

## 2026-09-02 — Merge feature/cva → main
**Done:**
- Fast-forward-merged `feature/cva` into `main` (`eb0a172..b5f55e7`) and pushed
  `origin/main`. `main` now == `feature/cva` — Angular 21, Jest, memory bank,
  commit rules, everything.
- Updated `activeContext` / `progress` (they claimed "main is stale on Angular 19").

**Decided:** merge as a fast-forward, not `--no-ff` — `feature/cva` history is
linear and `origin/main` (`eb0a172`) was a clean ancestor.

**Observed:**
- Local `main` had a stale, never-pushed commit `86bd497 "feature: test cva"`
  (plus `dadcefa`) that diverged from the line which became `feature/cva` — the
  branch had been rewritten at some point. Discarded it: verified its content
  (the `[dt]` inputNumber binding, `updateOn: 'blur'` validators, `amount2`
  without `required`) is already in `feature/cva` HEAD, so nothing lost.
- `git merge --ff-only` refused ("diverging branches"); used `git reset --hard
  feature/cva` on `main` instead, then pushed (remote push stayed a fast-forward).

**Next:** decide whether to keep or delete `feature/cva` (its name no longer
means anything now that it's == `main`). New work → fresh branch off `main`.

---

## 2026-09-02 — Conventional Commits rules
**Done:**
- Added `.claude/rules/conventional-commits.md` (types, repo scopes, breaking-change
  syntax, attribution footers, examples).
- Referenced it from `CLAUDE.md` under a new "Commit conventions" section.

**Decided:** [[decisions]] #11 — Conventional Commits by convention, no
`commitlint` / `husky`. `.claude/rules/` is now a committed location for
agent-facing rules.

**Observed:** past history mixes `feature:` (invalid) with `feat:` / `chore:`;
not rewritten.

**Next:** if commit drift returns, add `commitlint` + a `commit-msg` hook.

---

## 2026-09-02 — Karma/Jasmine → Jest migration
**Done:**
- Added `jest` 30, `jest-preset-angular` 17, `jest-environment-jsdom`, `@types/jest`;
  removed `karma*`, `jasmine-core`, `@types/jasmine`.
- New `jest.config.js` (spreads `createCjsPreset()`, `setupFilesAfterEnv:
  setup-jest.ts`); `setup-jest.ts` calls `setupZoneTestEnv()` from
  `jest-preset-angular/setup-env/zone`.
- Rewrote `tsconfig.spec.json`: `module: CommonJS`, `moduleResolution: node`,
  `types: [jest, node]`, includes `setup-jest.ts`.
- `angular.json`: deleted the `test` (`:karma`) architect target.
- `package.json` scripts: `test` → `jest`, added `test:watch`.
- Fixed all 12 previously-red CLI stub specs (providers / router / Formly config /
  a stubbed `ActivatedRoute` id for `UserDetailPage`).
- Coverage check: only `todo.store.ts` (the SignalStore) lacked a spec — added
  `todo.store.spec.ts` (13 behavioural tests, `TodoService` mocked, fakeAsync for
  the `debounceTime(300)` in `loadByQuery`). **`npm test` → 25 suites / 37 tests green.**
- `ng build --configuration development` still clean.
- Updated `CLAUDE.md`, `README.md`, `techContext`, `progress`, `activeContext`;
  wrote Serena memory `testing-setup`.
- Committed as `3bfa245` and pushed to `origin/feature/cva` (upstream set —
  the branch had no tracking ref before).

**Decided:** [[decisions]] #10 — Jest via `jest-preset-angular`, not the
experimental `@angular/build:unit-test` runner.

**Observed:**
- `jest-preset-angular` 17 needs an explicit `setupZoneTestEnv()` call — a bare
  `import '.../setup-env/zone'` no longer self-initialises (was "Need to call
  TestBed.initTestEnvironment() first").
- `provideRouter([])` is enough to make `ActivatedRoute` injectable in TestBed.
- `UserDetailPageComponent` template can't render without a loaded user
  (`[formGroup]="userForm"`, built in an `effect()`), so its spec feeds
  `ActivatedRoute` a real `id`.
- `karma` / `karma-source-map-support` linger in `node_modules/` as optional peer
  deps of `@angular-devkit/build-angular` — unused, not project deps.

**Next:** specs are still only "should create" smoke tests; behavioural tests
per pattern would be the real next step. Consider moving the build off
`@angular-devkit/build-angular` to `@angular/build` to drop the karma peer.

---

## 2026-09-02 — Angular 21 upgrade docs + agent tooling + journaling setup
**Done:**
- `CLAUDE.md` + `README.md` refreshed for the Angular 21 stack (versions, `.nvmrc`,
  `features/home`, Tailwind v4 wiring, `strictInputAccessModifiers`) — commit `6d6a732`.
- Installed `uv` to `~/.local/bin`.
- `.mcp.json` (project scope): `memory-bank` (`@allpepper/memory-bank-mcp`,
  `MEMORY_BANK_ROOT=<repo>/.memory-bank`) + `serena` (`serena-agent` via `uvx`,
  `--context claude-code --project <repo>`); approved in `.claude/settings.local.json`.
- Created this memory bank: `projectbrief`, `productContext`, `systemPatterns`,
  `techContext`, `activeContext`, `progress` — commit `ac4c2f5`.
- `.serena/project.yml` committed; `.mcp.json` git-ignored (`ec40844`).
- Added `journal.md` + `decisions.md` (append-only), cross-linked; `CLAUDE.md`
  gained a `## Memory bank` section — commits `7f30d76`, `85a0124`.
- Added `/hello` + `/bye` slash commands in `.claude/commands/` — commit `73d8765`.

**Decided:**
- `.mcp.json` is git-ignored — it carries machine-specific absolute paths
  (repo path, nvm version). See [[decisions]] #5.
- Serena from PyPI (`serena-agent`), not the git repo — git fetch of a pinned
  commit fails in this environment. See [[decisions]] #6.
- Serena LSP backend left at `typescript`. See [[decisions]] #7.
- Memory bank + decision log are committed and kept current each session. #8.

**Observed:**
- `ng test`: 12 SUCCESS / 12 FAILED. All failures are pre-existing CLI-scaffold
  stubs with no providers (NG0201 for `ActivatedRoute` / route-scoped state
  services). Not upgrade regressions.
- `ng build` (prod) fails on **budgets only** (compile + bundle succeed):
  initial bundle 1.27 MB > 1 MB; `home-page.component.scss` 19 kB > 8 kB because
  it does `@use "tailwindcss";` inside a component stylesheet. Dev build is clean.
- Running Karma here needs `CHROME_BIN` → a `--no-sandbox` Chromium wrapper and
  Node 22.23.2 (system shell defaults to 22.14.0, which breaks `ng test --include`).
- First doc commit accidentally swept in a pre-staged deletion of
  `.ai/mcp/mcp.json`; restored via `git commit --amend`.

**Next:**
- Restart Claude Code so the `serena` / `memory-bank` MCP servers load, then
  seed a couple of Serena memories (the `/bye` step that couldn't run this session).
- Decide Serena LSP backend: keep `typescript` vs switch to `angular`
  (needs `npm i -D @angular/language-server`).
- Optional: remove `@use "tailwindcss"` from `home-page.component.scss` and/or
  raise the `initial` budget in `angular.json`.
- Optional: fix the 12 stub specs (add `provideRouter([])` + route-scoped
  service providers per `TestBed`).
- Consider merging `feature/cva` into `main` (branch name no longer reflects
  its contents).
