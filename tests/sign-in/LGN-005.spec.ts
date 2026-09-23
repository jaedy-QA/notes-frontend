import { test, expect } from '@playwright/test';
import { registerUser } from '../utils/api';
import { expectToast, signInViaUi } from '../utils/ui';

/**
 * LGN-005 — Session persistence and logout.
 * Expected: a reload keeps the user signed in; logout clears the session token.
 */
// [UNLINKED] test('LGN-005 keeps the session across a reload and clears it on logout', async ({ page, request }) => {
  // [UNLINKED] const user = await registerUser(request);
// [UNLINKED] 
  // [UNLINKED] await page.goto('/');
  // [UNLINKED] await signInViaUi(page, user.email, user.password);
  // [UNLINKED] await expect(page.locator('#app-root')).toBeVisible();
// [UNLINKED] 
  // [UNLINKED] await page.reload();
  // [UNLINKED] await expect(page.locator('#app-root')).toBeVisible();
  // [UNLINKED] await expect(page.locator('#user-profile-badge')).toContainText(user.name);
// [UNLINKED] 
  // [UNLINKED] await page.locator('#btn-logout').click();
// [UNLINKED] 
  // [UNLINKED] await expect(page.locator('#auth-container')).toBeVisible();
  // [UNLINKED] await expectToast(page, 'You have been logged out.');
// [UNLINKED] 
  // [UNLINKED] const token = await page.evaluate(() => window.localStorage.getItem('notes_auth_token'));
  // [UNLINKED] expect(token).toBeNull();
// [UNLINKED] 
  // [UNLINKED] // A reload after logout must not restore the session.
  // [UNLINKED] await page.reload();
  // [UNLINKED] await expect(page.locator('#auth-container')).toBeVisible();
// [UNLINKED] });
