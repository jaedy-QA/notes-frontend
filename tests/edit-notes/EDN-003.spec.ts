import { test, expect } from '../fixtures';
import { createNote, getNotes } from '../utils/api';
import { uniqueNote } from '../utils/testdata';
import { fillNoteEditor, noteCardById, noteEditor } from '../utils/ui';

/**
 * EDN-003 — Title cannot be cleared on an existing note.
 * Expected: inline validation error, modal stays open, original title untouched.
 */
test('EDN-003 rejects an edit that clears the title', async ({ appPage, user, request }) => {
  const original = uniqueNote();
  const created = await createNote(request, user.token, original);

  await appPage.reload();
  await appPage.locator(`#btn-edit-note-${created.id}`).click();

  await fillNoteEditor(appPage, { title: '', content: 'Content edited but title removed' });
  await appPage.locator('#btn-save-note').click();

  await expect(appPage.locator('#modal-error-banner')).toHaveText('Title is required.');
  await expect(noteEditor(appPage)).toBeVisible();

  await appPage.locator('#btn-cancel-modal').click();

  await expect(noteCardById(appPage, created.id)).toContainText(original.title);

  const [saved] = await getNotes(request, user.token);
  expect(saved.title).toBe(original.title);
  expect(saved.content).toBe(original.content);
});
