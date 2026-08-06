import { Page, test as base, expect } from '@playwright/test';
import { RegisteredUser, registerUser } from './utils/api';

type NotesFixtures = {
  /** A freshly registered account — isolated, empty notes list. */
  user: RegisteredUser;
  /** A page already signed in as `user`, sitting on the notes dashboard. */
  appPage: Page;
};

export const test = base.extend<NotesFixtures>({
  user: async ({ request }, use) => {
    await use(await registerUser(request));
  },

  appPage: async ({ page, user }, use) => {
    // The app reads its session from localStorage (see api/authClient.ts),
    // so seeding the token skips the login UI for note-focused scenarios.
    await page.addInitScript((token) => {
      window.localStorage.setItem('notes_auth_token', token);
    }, user.token);

    await page.goto('/');
    await expect(page.locator('#app-root')).toBeVisible();

    await use(page);
  }
});

export { expect };
