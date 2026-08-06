import { test, expect } from '@playwright/test';
import { DEMO_USER } from '../utils/testdata';
import { expectToast } from '../utils/ui';

/**
 * LGN-004 — "Continue as Demo User" shortcut.
 * Expected: signs in as the seeded demo account without typing credentials.
 */
test('LGN-004 signs in through the demo user shortcut', async ({ page }) => {
  await page.goto('/');
  await page.locator('#btn-demo-login').click();

  await expect(page.locator('#app-root')).toBeVisible();
  await expectToast(page, `Welcome back, ${DEMO_USER.name}!`);
  await expect(page.locator('#user-profile-badge')).toContainText(DEMO_USER.name);

  // The demo account ships with seeded notes.
  await expect(page.locator('#section-title')).toHaveText('Active Notes');
  await expect(page.locator('[data-note-id]').first()).toBeVisible();
});
