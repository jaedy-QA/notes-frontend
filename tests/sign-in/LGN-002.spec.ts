import { test, expect } from '@playwright/test';
import { registerUser } from '../utils/api';
import { expectToast, signInViaUi } from '../utils/ui';

/**
 * LGN-002 — Sign in with a wrong password.
 * Expected: generic "Invalid email or password." error, no session created.
 */
test('LGN-002 rejects sign in with an incorrect password', async ({ page, request }) => {
  const user = await registerUser(request);

  await page.goto('/');
  await signInViaUi(page, user.email, 'WrongPassword999');

  await expectToast(page, 'Invalid email or password.');
  await expect(page.locator('#auth-container')).toBeVisible();
  await expect(page.locator('#app-root')).toHaveCount(0);

  const token = await page.evaluate(() => window.localStorage.getItem('notes_auth_token'));
  expect(token).toBeNull();
});
