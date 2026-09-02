# Active Context — angular-state-example

_Last updated: 2026-09-02 (chore/dynform-smoke merged to main)_

## Current branch

**`main` only** — HEAD `5f1c2cc`, == `origin/main`. Working tree clean, nothing in
flight. All four this-session branches were ff-merged into `main` and deleted
(local-only from `chore/build-cleanup` on — never pushed as branches). New work →
new branch off `main`.

`ng build` prod **and** dev finish with **zero WARNING/ERROR lines**;
`npm test` 25 suites / 37 tests green; `npm run e2e` 1 spec green.

⚠️ On a fresh clone use `npm ci` (a bare `npm install` from a wiped lock needs
`--legacy-peer-deps` once — `@angular/build` optional peers; see [[techContext]]).
For e2e: `npx playwright install chromium` once.

History note: a stale local-only `main` commit (`86bd497 "feature: test cva"`,
never pushed) was discarded during an earlier merge — its content was already in
the merged history (verified: the `[dt]` inputNumber binding + `updateOn: 'blur'`
validator config).

## In flight / recently done

Nothing in flight.

This session (all on `main`): scss budget fix; Formly → `dynform` route (bundle
1.27 MB → 672 kB, [[decisions]] #12); build tooling → `@angular/build` (#13);
build cleanup (warnings silenced, `platform-browser-dynamic` dropped);
Playwright smoke test for `/dynform` (#14).

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
