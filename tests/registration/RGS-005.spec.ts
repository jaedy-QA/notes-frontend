import { test, expect } from '@playwright/test';

/**
 * RGS-005 — Register / Sign In tab behaviour.
 * Expected: the Full Name field and "Create Account" action only exist on the Register tab.
 */
test('RGS-005 shows the Full Name field only on the Register tab', async ({ page }) => {
  await page.goto('/');

  // Sign In tab is the default.
  await expect(page.locator('#input-name')).toHaveCount(0);
  await expect(page.locator('#btn-submit-auth')).toContainText('Sign In');

  await page.locator('#tab-register').click();
  await expect(page.locator('#input-name')).toBeVisible();
  await expect(page.locator('#btn-submit-auth')).toContainText('Create Account');

  // Switching back hides it again and keeps the entered credentials.
  await page.locator('#input-email').fill('tab.switch@northqa.test');
  await page.locator('#tab-login').click();

  await expect(page.locator('#input-name')).toHaveCount(0);
  await expect(page.locator('#btn-submit-auth')).toContainText('Sign In');
  await expect(page.locator('#input-email')).toHaveValue('tab.switch@northqa.test');
});
