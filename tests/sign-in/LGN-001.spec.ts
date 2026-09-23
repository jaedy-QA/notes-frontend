import { test, expect } from '@playwright/test';
import { registerUser } from '../utils/api';
import { expectToast, signInViaUi } from '../utils/ui';

/**
 * LGN-001 — Sign in with valid credentials.
 * Expected: the dashboard loads and the header shows the signed-in user.
 */
// [UNLINKED] test('LGN-001 signs in with valid credentials', async ({ page, request }) => {
  // [UNLINKED] const user = await registerUser(request);
// [UNLINKED] 
  // [UNLINKED] await page.goto('/');
  // [UNLINKED] await signInViaUi(page, user.email, user.password);
// [UNLINKED] 
  // [UNLINKED] await expect(page.locator('#app-root')).toBeVisible();
  // [UNLINKED] await expectToast(page, `Welcome back, ${user.name}!`);
  // [UNLINKED] await expect(page.locator('#user-profile-badge')).toContainText(user.name);
  // [UNLINKED] await expect(page.locator('#btn-new-note')).toBeVisible();
// [UNLINKED] });
