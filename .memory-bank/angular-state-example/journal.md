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
