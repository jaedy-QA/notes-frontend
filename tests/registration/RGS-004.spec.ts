import { test, expect } from '@playwright/test';
import { registerUser } from '../utils/api';
import { expectToast, registerViaUi } from '../utils/ui';

/**
 * RGS-004 — Email addresses must be unique.
 * Expected: registering an already-used email is rejected.
 */
test('RGS-004 rejects registration with an email that already exists', async ({ page, request }) => {
  const existing = await registerUser(request);

  await page.goto('/');
  await registerViaUi(page, {
    name: 'Duplicate Tester',
    email: existing.email,
    password: existing.password
  });

  await expectToast(page, 'User with this email already exists');
  await expect(page.locator('#auth-container')).toBeVisible();
  await expect(page.locator('#app-root')).toHaveCount(0);
});
