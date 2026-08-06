import { Locator, Page, expect } from '@playwright/test';

/** Shared locators / UI actions. Element ids come straight from the components. */

export const toastContainer = (page: Page): Locator => page.locator('#toast-container');

export const noteEditor = (page: Page): Locator => page.locator('#modal-note-editor');

export const notesGrid = (page: Page): Locator => page.locator('#notes-grid');

/** A note card matched by its visible title. */
export const noteCardByTitle = (page: Page, title: string): Locator =>
  page.locator('[data-note-id]').filter({ hasText: title });

export const noteCardById = (page: Page, id: string): Locator => page.locator(`#note-card-${id}`);

export async function expectToast(page: Page, message: string | RegExp) {
  await expect(toastContainer(page)).toContainText(message);
}

/** Signs in through the Sign In tab of the auth form. */
export async function signInViaUi(page: Page, email: string, password: string) {
  await page.locator('#tab-login').click();
  await page.locator('#input-email').fill(email);
  await page.locator('#input-password').fill(password);
  await page.locator('#btn-submit-auth').click();
}

/** Fills the Register tab of the auth form and submits it. */
export async function registerViaUi(
  page: Page,
  user: { name: string; email: string; password: string }
) {
  await page.locator('#tab-register').click();
  await page.locator('#input-name').fill(user.name);
  await page.locator('#input-email').fill(user.email);
  await page.locator('#input-password').fill(user.password);
  await page.locator('#btn-submit-auth').click();
}

/** Fills the note editor modal. Pass only the fields the scenario cares about. */
export async function fillNoteEditor(
  page: Page,
  fields: { title?: string; content?: string; category?: string }
) {
  if (fields.title !== undefined) await page.locator('#input-note-title').fill(fields.title);
  if (fields.content !== undefined) await page.locator('#textarea-note-content').fill(fields.content);
  if (fields.category !== undefined) await page.locator('#select-note-category').selectOption(fields.category);
}

/** Native constraint-validation state of an input (used for HTML5 required checks). */
export async function isFieldValid(field: Locator): Promise<boolean> {
  return field.evaluate((el) => (el as HTMLInputElement).validity.valid);
}
