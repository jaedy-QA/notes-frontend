import { test, expect } from '../fixtures';
import { uniqueNote } from '../utils/testdata';
import { expectToast, fillNoteEditor, noteCardByTitle, noteEditor } from '../utils/ui';

/**
 * CRN-001 — Create the first note from the empty state.
 * Expected: the note is saved and replaces the empty state in the grid.
 */
test('CRN-001 creates the first note from the empty state', async ({ appPage }) => {
  const note = uniqueNote({ category: 'Work' });

  await expect(appPage.locator('#empty-state')).toContainText('No notes yet');
  await appPage.locator('#btn-empty-create-note').click();

  await expect(noteEditor(appPage)).toBeVisible();
  await expect(appPage.locator('#modal-title')).toHaveText('Create New Note');

  await fillNoteEditor(appPage, note);
  await appPage.locator('#btn-save-note').click();

  await expect(noteEditor(appPage)).toHaveCount(0);
  await expectToast(appPage, 'New note created.');

  const card = noteCardByTitle(appPage, note.title);
  await expect(card).toBeVisible();
  await expect(card).toContainText(note.content);
  await expect(card).toContainText(note.category);
  await expect(appPage.locator('#empty-state')).toHaveCount(0);
});
