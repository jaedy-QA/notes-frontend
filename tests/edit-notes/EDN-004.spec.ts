import { test, expect } from '../fixtures';
import { createNote, getNotes } from '../utils/api';
import { uniqueNote } from '../utils/testdata';
import { fillNoteEditor, noteCardById, noteEditor } from '../utils/ui';

/**
 * EDN-004 — Cancelling an edit discards the changes.
 * Expected: nothing is persisted and reopening the editor shows the original values.
 */
test('EDN-004 discards edits when the modal is cancelled', async ({ appPage, user, request }) => {
  const original = uniqueNote({ category: 'Personal' });
  const created = await createNote(request, user.token, original);

  await appPage.reload();
  await appPage.locator(`#btn-edit-note-${created.id}`).click();
  await fillNoteEditor(appPage, {
    title: 'Discarded title',
    content: 'Discarded content',
    category: 'Tasks'
  });
  await appPage.locator('#btn-cancel-modal').click();

  await expect(noteEditor(appPage)).toHaveCount(0);

  const card = noteCardById(appPage, created.id);
  await expect(card).toContainText(original.title);
  await expect(card).toContainText(original.category);
  await expect(card).not.toContainText('Discarded title');

  const [saved] = await getNotes(request, user.token);
  expect(saved.title).toBe(original.title);
  expect(saved.content).toBe(original.content);
  expect(saved.category).toBe(original.category);

  // Reopening shows the stored values, not the discarded draft.
  await appPage.locator(`#btn-edit-note-${created.id}`).click();
  await expect(appPage.locator('#input-note-title')).toHaveValue(original.title);
  await expect(appPage.locator('#textarea-note-content')).toHaveValue(original.content);
  await expect(appPage.locator('#select-note-category')).toHaveValue(original.category);
});
