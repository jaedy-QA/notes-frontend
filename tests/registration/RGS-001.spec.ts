import { test, expect } from '@playwright/test';
import { newUser } from '../utils/testdata';
import { expectToast, registerViaUi, toastContainer } from '../utils/ui';

/**
 * RGS-001 — Register a new account with valid data.
 * Expected: account is created, user lands on the dashboard with an empty notes list.
 */
test('RGS-001 registers a new account with valid details', async ({ page }) => {
  const user = newUser();

  await page.goto('/');
  await expect(page.locator('#auth-container')).toBeVisible();

  await registerViaUi(page, user);

  await expect(page.locator('#app-root')).toBeVisible();
  // A brand new account gets the first-time greeting, never "Welcome back".
  await expectToast(page, `Welcome, ${user.name}! Your account is ready.`);
  await expect(toastContainer(page)).not.toContainText('Welcome back');

  await expect(page.locator('#user-profile-badge')).toContainText(user.name);
  await expect(page.locator('#empty-state')).toContainText('No notes yet');
  await expect(page.locator('#auth-container')).toHaveCount(0);
});
