# Tech Context — angular-state-example

## Stack & versions (as of 2026-09-02)

| Area | Choice |
|---|---|
| Framework | Angular **21** (`@angular/* ^21.2.22`), standalone, zone-based CD |
| State libs | `@ngrx/signals` **21**, `@ngrx/operators` 21 |
| UI | PrimeNG **21** (`primeng`, `@primeng/themes`), `primeicons` 7 |
| CSS | Tailwind **v4** (`@tailwindcss/postcss`), `tailwindcss-primeui` |
| Forms | `@ngx-formly/core` + `@ngx-formly/primeng` 7, `json-logic-js` 2 |
| Rx | `rxjs` ~7.8 |
| Build | **`@angular/build`** (`:application` / `:dev-server` / `:extract-i18n` builders), `browser: src/main.ts`, out `dist/angular-state-example`. `@angular-devkit/build-angular` (+ its webpack/karma tree) removed — see [[decisions]] #13. |
| Test | **Jest** 30 + `jest-preset-angular` 17 (jsdom, `setup-jest.ts`). Config: `jest.config.js`, `tsconfig.spec.json` (`types: [jest, node]`). No `test` target in `angular.json` — `@angular/build:unit-test` (Vitest) is available but unused. No e2e runner. |
| TS | `typescript` ~5.9, `strict` + `strictTemplates` + `strictInjectionParameters` + `strictInputAccessModifiers` + `noPropertyAccessFromIndexSignature` |
| Node | pinned in `.nvmrc` → **22.23.2** (nvm default alias also 22.23.2) |

## Commands

- `npm start` / `ng serve` → http://localhost:4200/
- `ng build` → `dist/`
- `npm test` / `npx jest` → Jest, single run by default
- `npm run test:watch` → Jest watch mode
- `npx jest todo.service` → run specs matching a path fragment (regex, not glob)
- `ng generate component features/<feature>/...` → CLI schematics, style: scss

## Not present (don't assume)

- No `npm run lint`, no ESLint/Prettier config.
- No e2e.
- No real HTTP backend — every repository is an in-memory mock with `delay(...)`.

## Dependency install gotcha

- `npm ci` and `npm install` (against the committed lockfile) both work clean.
  A **from-scratch re-resolve** (`rm package-lock.json && npm install`, or
  `npm install <new-pkg>`) hits an `ERESOLVE` on `@angular/build`'s *optional*
  peers (`@angular/localize`, `ng-packagr` — unused here). Fix: re-run with
  `--legacy-peer-deps` once, then the settled lockfile installs cleanly again.
  See [[decisions]] #13.

## Conventions enforced by tooling

- Single quotes, 2-space indent (`.editorconfig`).
- Respect strict TS/template flags — don't widen types to silence errors.
- Some comments / console messages are in French; match the file's existing style.

## MCP / agent tooling in this repo

- `.mcp.json` (project scope, requires approval on `claude` start):
  - `memory-bank` → `@allpepper/memory-bank-mcp`, `MEMORY_BANK_ROOT=<repo>/.memory-bank`
    (this file lives under `.memory-bank/angular-state-example/`).
  - `serena` → `uvx --from serena-agent serena start-mcp-server --context claude-code
    --project <repo>`; `uv` installed at `~/.local/bin`. Serena LSP backend =
    `typescript` (see `.serena/project.yml`; `angular` backend is an option but
    `@angular/language-server` is not installed).
- `npx` is NOT on the MCP servers' PATH — commands use the absolute nvm path.
- Also configured (user scope): `webstorm` (connected), `idea` (often down),
  `context7` (fails: bare `npx` not found).

## Related

- [[systemPatterns]] · [[activeContext]] · [[progress]]
