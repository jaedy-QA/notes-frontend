import { test, expect } from '@playwright/test';
import { registerUser } from '../utils/api';
import { expectToast, signInViaUi } from '../utils/ui';

/**
 * LGN-005 — Session persistence and logout.
 * Expected: a reload keeps the user signed in; logout clears the session token.
 */
test('LGN-005 keeps the session across a reload and clears it on logout', async ({ page, request }) => {
  const user = await registerUser(request);

  await page.goto('/');
  await signInViaUi(page, user.email, user.password);
  await expect(page.locator('#app-root')).toBeVisible();

  await page.reload();
  await expect(page.locator('#app-root')).toBeVisible();
  await expect(page.locator('#user-profile-badge')).toContainText(user.name);

  await page.locator('#btn-logout').click();

  await expect(page.locator('#auth-container')).toBeVisible();
  await expectToast(page, 'You have been logged out.');

  const token = await page.evaluate(() => window.localStorage.getItem('notes_auth_token'));
  expect(token).toBeNull();

  // A reload after logout must not restore the session.
  await page.reload();
  await expect(page.locator('#auth-container')).toBeVisible();
});
