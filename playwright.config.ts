import { defineConfig, devices } from '@playwright/test';

/**
 * Smoke-level e2e (Playwright). Kept deliberately thin — the point of this repo is
 * the state/form patterns, not e2e coverage. Specs live in `e2e/*.e2e.ts`.
 * Run: `npm run e2e` (starts `ng serve` itself). Jest specs are `*.spec.ts` and
 * are untouched by this config.
 */
export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? 'list' : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
  },
});
