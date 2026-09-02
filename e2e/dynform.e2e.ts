import { test, expect } from '@playwright/test';

/**
 * Smoke check for `features/dynform`. Its Formly config (`provideFormlyCore([
 * ...withFormlyPrimeNG(), ...])`) is registered on the *route* (`dynform.routes.ts`),
 * not in `app.config.ts` — see decisions.md #12. If that wiring didn't reach the
 * lazily-loaded page, Formly would fail to resolve the field types and log
 * "type 'input' is not recognized" etc. This test asserts the opposite: every
 * PrimeNG-backed field type + the custom `repeat-table` type actually render, with
 * a clean console.
 */
test('dynform page renders the Formly form with no console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(String(err)));

  await page.goto('/dynform');

  // The page shell
  await expect(page.getByRole('heading', { name: /Dynamics forms/i })).toBeVisible();
  // Wait for Formly to have rendered the field list
  await expect(page.locator('input.p-inputtext').first()).toBeVisible();
  await page.screenshot({ path: 'test-results/dynform.png', fullPage: true });

  // Formly resolved each field type into its PrimeNG component
  await expect(page.locator('input.p-inputtext').first()).toBeVisible(); // input / email
  await expect(page.locator('p-select').first()).toBeVisible();          // select
  await expect(page.locator('p-checkbox').first()).toBeVisible();        // checkbox / subscribe
  await expect(page.locator('p-radiobutton').first()).toBeVisible();     // radio

  // Custom `repeat-table` type + the `panel` wrapper
  await expect(page.locator('table').first()).toBeVisible();
  await expect(page.getByText('Input', { exact: true })).toBeVisible();  // panel wrapper label

  // Actions
  await expect(page.getByRole('button', { name: 'Valider' })).toBeVisible();

  // The jsonLogic-hidden `textarea` field starts absent from the DOM…
  await expect(page.locator('textarea')).toHaveCount(0);
  // …and appears once its rule (select === '2' && checkbox checked) is satisfied
  await page.locator('p-checkbox').first().click();
  await page.locator('p-select').first().click();
  await page.getByRole('option', { name: 'Option 2' }).click();
  await expect(page.locator('textarea')).toBeVisible();

  expect(errors, `console errors:\n${errors.join('\n')}`).toEqual([]);
});
