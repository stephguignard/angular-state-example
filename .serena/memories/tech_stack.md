# Tech stack

- **Angular 21** (`^21.2.22`), standalone components only, **no NgModules**.
- TypeScript `~5.9.3`. RxJS `~7.8`. zone.js `~0.15` (still zoneful).
- Package manager: **npm** (`package-lock.json`). From-scratch `npm install` needs
  `--legacy-peer-deps` once (`@angular/build` optional peers); `npm ci` is clean.
- Node pinned in `.nvmrc` = **22.23.2** — `ng build` requires it. System default may
  differ; prepend `~/.nvm/versions/node/v22.23.2/bin` to PATH. Jest runs on any Node.

## Build / runner
- Build: **`@angular/build`** (esbuild) — since 2026-09-02, replaced
  `@angular-devkit/build-angular` (webpack/karma removed). `angular.json` has
  **no `test` target** → `ng test` does not work.
- Unit tests: **Jest** (`jest-preset-angular` v17, jsdom). Not Karma. See `mem:testing-setup`.
- e2e: **Playwright** (`@playwright/test`), one smoke spec. `mem:testing-setup`.

## State / forms libs
- `@ngrx/signals` + `@ngrx/operators` `^21.1` (todo store).
- `@ngx-formly/core` + `@ngx-formly/primeng` `^7.0` (dynform).
- `json-logic-js` `^2.0` (dynform conditional-logic layer).
- Angular `rxResource` / `rxMethod` (user, invoice).

## UI / styling (coexist intentionally)
- **PrimeNG 21** + `@primeng/themes` + `primeicons`. Custom `CustomPreset` in `app.config.ts`.
- **Tailwind v4** — CSS-first, no `tailwind.config.js`. `@tailwindcss/postcss` in
  `.postcssrc.json`; `src/tailwind.css` `@import`s `tailwindcss` + `tailwindcss-primeui`,
  pulled in via `src/styles.scss`.

## No lint/format tooling
No ESLint/Prettier config, **no `npm run lint`**. Style enforced only by `.editorconfig`
+ `tsconfig` strict flags. Do not assume a lint script exists.
