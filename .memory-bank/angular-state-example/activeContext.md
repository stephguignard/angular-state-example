# Active Context — angular-state-example

_Last updated: 2026-09-02 (feature/cva merged into main + deleted)_

## Current branch

**`main` only** — HEAD `ed2666b`, pushed. `feature/cva` was fast-forward-merged
into `main` (`eb0a172..b5f55e7`) then deleted (local + remote). `main` carries the
full Angular 19 → 21 upgrade chain, the Jest migration, the memory bank and the
commit rules. Working tree clean, nothing in flight. New work → new branch off
`main`.

History note: a stale local-only `main` commit (`86bd497 "feature: test cva"`,
never pushed) was discarded during the merge — its content was already present
in the merged history (verified: the `[dt]` inputNumber binding + `updateOn:
'blur'` validator config).

## In flight / recently done

- **Docs refresh** (`6d6a732`): `CLAUDE.md` + `README.md` for the Angular 21 stack.
- **Agent tooling** (`ac4c2f5`): `.mcp.json` (git-ignored) with `memory-bank`
  (`@allpepper/memory-bank-mcp`) + `serena` (`serena-agent` via `uvx`); `uv`
  installed to `~/.local/bin`; `.serena/project.yml` committed.
- **Memory bank** (`ac4c2f5`, `7f30d76`): 8 files under
  `.memory-bank/angular-state-example/` incl. append-only `journal.md` +
  `decisions.md`; `CLAUDE.md` points at the workflow (`85a0124`).
- **Session commands** (`73d8765`): `.claude/commands/hello.md` (load memory +
  status recap) and `.claude/commands/bye.md` (this housekeeping routine).
- **Jest migration** (`3bfa245`, 2026-09-02): Karma/Jasmine → Jest
  (`jest-preset-angular` 17). New `jest.config.js` + `setup-jest.ts`; rewrote
  `tsconfig.spec.json`; dropped the `test` target from `angular.json`; removed
  `karma*` / `jasmine*` / `@types/jasmine` devDeps; `npm test` → `jest`. All 12
  previously-red CLI stub specs fixed; added `todo.store.spec.ts` (13 behavioural
  tests — the SignalStore had none). **25 suites / 37 tests green.**
  See [[decisions]] #10.
- **Commit conventions** (`b5f55e7`, 2026-09-02): `.claude/rules/conventional-commits.md`
  + a "Commit conventions" section in `CLAUDE.md`. Conventional Commits 1.0.0, no
  `commitlint`. See [[decisions]] #11.
- **Merge to `main`** (2026-09-02): `feature/cva` fast-forwarded into `main`,
  pushed, then the branch was deleted (local + remote). `main` is the only branch.

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
