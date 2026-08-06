import { test, expect } from '@playwright/test';
import { newUser } from '../utils/testdata';
import { expectToast, registerViaUi } from '../utils/ui';

/**
 * RGS-003 — Password shorter than the 6 character minimum.
 * Expected: auth-service rejects it and the user stays on the auth screen.
 */
test('RGS-003 rejects a password shorter than 6 characters', async ({ page }) => {
  const user = newUser({ password: 'abc12' });

  await page.goto('/');
  await registerViaUi(page, user);

  await expectToast(page, 'Password must be at least 6 characters long.');
  await expect(page.locator('#auth-container')).toBeVisible();
  await expect(page.locator('#app-root')).toHaveCount(0);
});
