# Active Context — angular-state-example

_Last updated: 2026-09-02_

## Current branch

`feature/cva` — despite the name, it carries the whole **Angular 19 → 21 upgrade
chain** plus tooling/docs. `main` is still on Angular 19 and is significantly
behind. Treat `feature/cva` as the working trunk. Not yet merged/pushed.

Branch is ~14 commits ahead of `main`; the 6 most recent are this session's
tooling + docs work (`6d6a732` … `73d8765`).

## In flight / recently done

All committed on `feature/cva`, nothing uncommitted:

- **Docs refresh** (`6d6a732`): `CLAUDE.md` + `README.md` for the Angular 21 stack.
- **Agent tooling** (`ac4c2f5`): `.mcp.json` (git-ignored) with `memory-bank`
  (`@allpepper/memory-bank-mcp`) + `serena` (`serena-agent` via `uvx`); `uv`
  installed to `~/.local/bin`; `.serena/project.yml` committed.
- **Memory bank** (`ac4c2f5`, `7f30d76`): 8 files under
  `.memory-bank/angular-state-example/` incl. append-only `journal.md` +
  `decisions.md`; `CLAUDE.md` points at the workflow (`85a0124`).
- **Session commands** (`73d8765`): `.claude/commands/hello.md` (load memory +
  status recap) and `.claude/commands/bye.md` (this housekeeping routine).

## Open decisions

1. **Serena LSP backend** — keep `typescript` (works out of the box) vs switch
   `.serena/project.yml` to `angular` (needs `npm i -D @angular/language-server`).
   See [[decisions]] #7.

## Watch out

- MCP servers `serena` / `memory-bank` were added to `.mcp.json` mid-session and
  need a Claude Code restart to load. Approved in `.claude/settings.local.json`.
  Until a restart, `/hello` and `/bye` run on the files only (no Serena memory).
- The pinned nvm path `~/.nvm/versions/node/v22.23.2/bin/npx` in `.mcp.json`
  breaks if that Node version is removed.
- Running `ng test` / `ng build` here needs Node 22.23.2 on PATH and
  `CHROME_BIN` → a `--no-sandbox` Chromium wrapper (see [[progress]]).
- When editing a feature, keep its pattern — see [[systemPatterns]]. The `user`
  feature has two search services that usually both need the change.

## Related

- [[progress]] · [[systemPatterns]] · [[techContext]] · [[journal]] · [[decisions]]
