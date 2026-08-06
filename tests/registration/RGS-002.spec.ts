import { test, expect } from '@playwright/test';
import { newUser } from '../utils/testdata';
import { isFieldValid } from '../utils/ui';

/**
 * RGS-002 — Required fields block submission.
 * Expected: the form is not submitted and the user stays on the auth screen.
 */
test('RGS-002 blocks registration when required fields are empty', async ({ page }) => {
  const user = newUser();

  await page.goto('/');
  await page.locator('#tab-register').click();

  // Submit with everything blank.
  await page.locator('#btn-submit-auth').click();
  expect(await isFieldValid(page.locator('#input-name'))).toBe(false);
  await expect(page.locator('#auth-container')).toBeVisible();

  // Name filled, email and password still blank.
  await page.locator('#input-name').fill(user.name);
  await page.locator('#btn-submit-auth').click();
  expect(await isFieldValid(page.locator('#input-email'))).toBe(false);
  await expect(page.locator('#auth-container')).toBeVisible();

  // Name and email filled, password still blank.
  await page.locator('#input-email').fill(user.email);
  await page.locator('#btn-submit-auth').click();
  expect(await isFieldValid(page.locator('#input-password'))).toBe(false);

  await expect(page.locator('#app-root')).toHaveCount(0);
});
