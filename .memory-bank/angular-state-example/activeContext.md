# Active Context — angular-state-example

_Last updated: 2026-09-02_

## Current branch

`feature/cva` — despite the name, it carries the whole **Angular 19 → 21 upgrade
chain** plus tooling docs. `main` is still on Angular 19 and is significantly
behind. Treat `feature/cva` as the working trunk.

Recent commits on the branch:
- `docs: refresh CLAUDE.md and README for Angular 21 stack`
- `chore: upgrade to PrimeNG 21 and @ngrx/signals 21`
- `chore: upgrade to Angular 21` (+ `.nvmrc` pin to 22.23.2)
- earlier: upgrades to Angular/PrimeNG 20, `feature: test cva`, dynform group-field test

## In flight / recently done

- **Docs refresh** (committed): `CLAUDE.md` + `README.md` updated for the
  Angular 21 stack — version bumps, `.nvmrc` note, `features/home` mention,
  Tailwind v4 wiring, `strictInputAccessModifiers`.
- **Agent tooling setup**: added `.mcp.json` with `memory-bank`
  (`@allpepper/memory-bank-mcp`) and `serena` (`serena-agent` via `uvx`);
  installed `uv` to `~/.local/bin`; Serena auto-generated `.serena/`
  (`project.yml`, self-ignored `project.local.yml` + `cache/`).
  `.mcp.json` is **git-ignored** (`.gitignore` → `/.mcp.json`) because it holds
  machine-specific absolute paths.
- **This memory bank** + `.serena/project.yml` committed (`ac4c2f5`).

## Open decisions

1. Serena LSP backend: keep `typescript` (works out of the box) vs switch
   `.serena/project.yml` to `angular` (better for templates, needs
   `@angular/language-server` which isn't installed).

## Watch out

- The pinned nvm path `~/.nvm/versions/node/v22.23.2/bin/npx` in `.mcp.json`
  breaks if that Node version is removed.
- When editing a feature, keep its pattern — see [[systemPatterns]]. The `user`
  feature has two search services that usually both need the change.

## Related

- [[progress]] · [[systemPatterns]] · [[techContext]]
