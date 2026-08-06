import { test, expect } from '@playwright/test';
import { uniqueEmail, VALID_PASSWORD } from '../utils/testdata';
import { expectToast, signInViaUi } from '../utils/ui';

/**
 * LGN-003 — Sign in with an email that was never registered.
 * Expected: same generic error as a wrong password (no account enumeration).
 */
test('LGN-003 rejects sign in with an unregistered email', async ({ page }) => {
  await page.goto('/');
  await signInViaUi(page, uniqueEmail('unknown'), VALID_PASSWORD);

  await expectToast(page, 'Invalid email or password.');
  await expect(page.locator('#auth-container')).toBeVisible();
  await expect(page.locator('#app-root')).toHaveCount(0);
});
