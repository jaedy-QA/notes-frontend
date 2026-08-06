import { test, expect } from '../fixtures';
import { fillNoteEditor, noteEditor } from '../utils/ui';

/**
 * CRN-003 — Title is mandatory.
 * Expected: saving without a real title shows an inline error and keeps the modal open.
 */
test('CRN-003 requires a title before a note can be saved', async ({ appPage }) => {
  await appPage.locator('#btn-new-note').click();
  await expect(noteEditor(appPage)).toBeVisible();

  // Empty title.
  await fillNoteEditor(appPage, { content: 'Body without a title' });
  await appPage.locator('#btn-save-note').click();

  await expect(appPage.locator('#modal-error-banner')).toHaveText('Title is required.');
  await expect(noteEditor(appPage)).toBeVisible();

  // Whitespace-only title is treated the same way.
  await fillNoteEditor(appPage, { title: '     ' });
  await appPage.locator('#btn-save-note').click();

  await expect(appPage.locator('#modal-error-banner')).toHaveText('Title is required.');
  await expect(noteEditor(appPage)).toBeVisible();

  // Nothing was persisted.
  await appPage.locator('#btn-cancel-modal').click();
  await expect(appPage.locator('#empty-state')).toContainText('No notes yet');
});
