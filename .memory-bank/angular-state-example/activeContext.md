# Active Context — angular-state-example

_Last updated: 2026-09-02 (fix/prod-build-budgets merged to main)_

## Current branch

**`main` only** — HEAD `8c605a7`, == `origin/main`. Working tree clean, nothing
in flight. `fix/prod-build-budgets` was fast-forwarded into `main`, pushed, then
deleted (local + `origin`). New work → new branch off `main`.

`fix/prod-build-budgets` delivered (all on `main` now):
1. `f95efa3` `fix(home)` — `home-page.component.scss` stops inlining Tailwind
   (`@use` + `.card-selection` `@apply` removed, utilities moved to the template).
2. `2a0681e` `perf(dynform)` — `provideFormlyCore([...])` moved from
   `app.config.ts` to `dynform.routes.ts` `providers`. Initial bundle 1.27 MB →
   672 kB. [[decisions]] #12.
3. `8b988dc` `build(deps)` — `@angular-devkit/build-angular` → `@angular/build`
   (drops the webpack/karma tree); `@angular/*` 21.2.20 → 21.2.22. [[decisions]] #13.
   (+ `docs(memory-bank)` commits `fefe50b` / `10db9cc` / `e23564f` / `7befc84`.)

`ng build` prod now **passes** (only the 500 kB initial `maximumWarning` left).

History note: a stale local-only `main` commit (`86bd497 "feature: test cva"`,
never pushed) was discarded during an earlier merge — its content was already in
the merged history (verified: the `[dt]` inputNumber binding + `updateOn: 'blur'`
validator config).

## In flight / recently done

Nothing in flight.

⚠️ On a fresh clone use `npm ci` (a bare `npm install` from a wiped lock needs
`--legacy-peer-deps` once — `@angular/build` optional peers; see [[techContext]]).

This session (all on `main`): scss budget fix, Formly → route (bundle 1.27 MB →
672 kB), build tooling `@angular-devkit/build-angular` → `@angular/build`.

Earlier this day / pre-session (for context):

- **Jest migration** (`3bfa245`): Karma/Jasmine → Jest (`jest-preset-angular` 17).
  `jest.config.js` + `setup-jest.ts`; rewrote `tsconfig.spec.json`; dropped the
  `test` target from `angular.json`; removed `karma*` / `jasmine*` devDeps;
  `npm test` → `jest`. Fixed the 12 red CLI stub specs; added `todo.store.spec.ts`
  (13 behavioural tests). **25 suites / 37 tests green.** See [[decisions]] #10.
- **Commit conventions** (`b5f55e7`): `.claude/rules/conventional-commits.md` +
  "Commit conventions" in `CLAUDE.md`. Conventional Commits 1.0.0, no `commitlint`.
  See [[decisions]] #11.
- **Merge + cleanup** (`ed2666b`, `c5a8dac`): `feature/cva` → `main`, branch
  deleted, memory bank updated to match.

Earlier (pre-session, for context): Angular 19→21 upgrade chain, PrimeNG/@ngrx 21,
`CLAUDE.md`/`README` refresh, agent tooling (`.mcp.json`, Serena), memory-bank +
journal/decision logs, `/hello` + `/bye` commands.

## Open decisions

1. **Serena LSP backend** — keep `typescript` (works out of the box) vs switch
   `.serena/project.yml` to `angular` (needs `npm i -D @angular/language-server`).
   See [[decisions]] #7.

## Watch out

- MCP servers `serena` / `memory-bank` are connected (confirmed this session).
  Serena memories live alongside the memory-bank — `testing-setup` holds the Jest
  gotchas. Approved in `.claude/settings.local.json` (git-ignored, re-approve per
  machine).
- The pinned nvm path `~/.nvm/versions/node/v22.23.2/bin/npx` in `.mcp.json`
  breaks if that Node version is removed.
- `ng build` here needs Node 22.23.2 on PATH. Tests (`npm test` / `jest`) run on
  any Node, no browser / `CHROME_BIN` needed since the Jest migration.
- When editing a feature, keep its pattern — see [[systemPatterns]]. The `user`
  feature has two search services that usually both need the change.

## Related

- [[progress]] · [[systemPatterns]] · [[techContext]] · [[journal]] · [[decisions]]
