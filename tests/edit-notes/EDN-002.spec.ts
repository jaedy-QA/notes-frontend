import { test, expect } from '../fixtures';
import { createNote, getNotes } from '../utils/api';
import { uniqueNote } from '../utils/testdata';
import { expectToast, fillNoteEditor, noteCardById, noteEditor } from '../utils/ui';

/**
 * EDN-002 — Update title, content and category of an existing note.
 * Expected: the card and the backend both reflect the new values.
 */
test('EDN-002 updates the title, content and category of a note', async ({ appPage, user, request }) => {
  const original = uniqueNote({ category: 'General' });
  const created = await createNote(request, user.token, original);

  const updated = {
    title: `${original.title} (updated)`,
    content: 'Rewritten content after the review.',
    category: 'Work'
  };

  await appPage.reload();
  await appPage.locator(`#btn-edit-note-${created.id}`).click();
  await fillNoteEditor(appPage, updated);
  await appPage.locator('#btn-save-note').click();

  await expect(noteEditor(appPage)).toHaveCount(0);
  await expectToast(appPage, 'Note updated successfully.');

  const card = noteCardById(appPage, created.id);
  await expect(card).toContainText(updated.title);
  await expect(card).toContainText(updated.content);
  await expect(card).toContainText(updated.category);
  await expect(card).not.toContainText(original.content);

  const [saved] = await getNotes(request, user.token);
  expect(saved.title).toBe(updated.title);
  expect(saved.content).toBe(updated.content);
  expect(saved.category).toBe(updated.category);

  // Still one note — an edit must not create a duplicate.
  await expect(appPage.locator('[data-note-id]')).toHaveCount(1);
});
