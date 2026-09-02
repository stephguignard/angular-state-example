# Active Context — angular-state-example

_Last updated: 2026-09-02 (Jest + commit rules + feature/cva merged & deleted)_

## Current branch

**`main` only** — HEAD `c5a8dac`, == `origin/main`. Working tree clean, nothing
in flight. `feature/cva` was fast-forwarded into `main` then deleted (local +
remote); new work → new branch off `main`.

History note: a stale local-only `main` commit (`86bd497 "feature: test cva"`,
never pushed) was discarded during the merge — its content was already in the
merged history (verified: the `[dt]` inputNumber binding + `updateOn: 'blur'`
validator config).

## In flight / recently done

Nothing in flight. This session (all committed + pushed on `main`):

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
