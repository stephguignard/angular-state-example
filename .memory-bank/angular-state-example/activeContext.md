# Active Context — angular-state-example

_Last updated: 2026-09-02 (Jest migration + commit-convention rules)_

## Current branch

`feature/cva` — despite the name, it carries the whole **Angular 19 → 21 upgrade
chain** plus tooling/docs. `main` is still on Angular 19 and is significantly
behind. Treat `feature/cva` as the working trunk. **Pushed** to
`origin/feature/cva` (upstream set); not merged to `main`.

Branch is ~17 commits ahead of `main`; HEAD `0bb93d8` pushed. Uncommitted:
the Conventional Commits rules file + its docs.

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
- **Commit conventions** (uncommitted, 2026-09-02): `.claude/rules/conventional-commits.md`
  + a "Commit conventions" section in `CLAUDE.md`. Conventional Commits 1.0.0, no
  `commitlint`. See [[decisions]] #11.

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
