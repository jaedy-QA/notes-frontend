import { test, expect } from '../fixtures';
import { createNote } from '../utils/api';
import { uniqueNote } from '../utils/testdata';
import { noteEditor } from '../utils/ui';

/**
 * EDN-001 — The editor pre-populates the selected note.
 * Expected: title, content and category are loaded and the modal is in "Edit Note" mode.
 */
test('EDN-001 pre-populates the editor with the existing note', async ({ appPage, user, request }) => {
  const note = uniqueNote({ category: 'Ideas' });
  const created = await createNote(request, user.token, note);

  await appPage.reload();
  await appPage.locator(`#btn-edit-note-${created.id}`).click();

  await expect(noteEditor(appPage)).toBeVisible();
  await expect(appPage.locator('#modal-title')).toHaveText('Edit Note');
  await expect(appPage.locator('#input-note-title')).toHaveValue(note.title);
  await expect(appPage.locator('#textarea-note-content')).toHaveValue(note.content);
  await expect(appPage.locator('#select-note-category')).toHaveValue('Ideas');

  // Editable, and no archived restriction banner.
  await expect(appPage.locator('#input-note-title')).toBeEnabled();
  await expect(appPage.locator('#btn-save-note')).toBeVisible();
  await expect(appPage.locator('#archived-rule-warning')).toHaveCount(0);
});
