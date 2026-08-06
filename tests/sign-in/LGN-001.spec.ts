import { test, expect } from '@playwright/test';
import { registerUser } from '../utils/api';
import { expectToast, signInViaUi } from '../utils/ui';

/**
 * LGN-001 — Sign in with valid credentials.
 * Expected: the dashboard loads and the header shows the signed-in user.
 */
test('LGN-001 signs in with valid credentials', async ({ page, request }) => {
  const user = await registerUser(request);

  await page.goto('/');
  await signInViaUi(page, user.email, user.password);

  await expect(page.locator('#app-root')).toBeVisible();
  await expectToast(page, `Welcome back, ${user.name}!`);
  await expect(page.locator('#user-profile-badge')).toContainText(user.name);
  await expect(page.locator('#btn-new-note')).toBeVisible();
});
