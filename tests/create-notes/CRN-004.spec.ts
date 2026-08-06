import { test, expect } from '../fixtures';
import { getNotes } from '../utils/api';
import { uniqueNote } from '../utils/testdata';
import { fillNoteEditor, noteCardByTitle, noteEditor } from '../utils/ui';

/**
 * CRN-004 — Cancelling the editor discards the draft.
 * Expected: no note is created and the editor reopens blank.
 */
test('CRN-004 discards the note when the editor is cancelled', async ({ appPage, user, request }) => {
  const note = uniqueNote();

  await appPage.locator('#btn-new-note').click();
  await fillNoteEditor(appPage, note);
  await appPage.locator('#btn-cancel-modal').click();

  await expect(noteEditor(appPage)).toHaveCount(0);
  await expect(noteCardByTitle(appPage, note.title)).toHaveCount(0);
  await expect(appPage.locator('#empty-state')).toContainText('No notes yet');

  expect(await getNotes(request, user.token)).toEqual([]);

  // Reopening the editor starts from a clean form.
  await appPage.locator('#btn-new-note').click();
  await expect(appPage.locator('#input-note-title')).toHaveValue('');
  await expect(appPage.locator('#textarea-note-content')).toHaveValue('');
  await expect(appPage.locator('#select-note-category')).toHaveValue('General');

  // The X button discards the draft too.
  await fillNoteEditor(appPage, note);
  await appPage.locator('#btn-close-modal').click();

  await expect(noteEditor(appPage)).toHaveCount(0);
  expect(await getNotes(request, user.token)).toEqual([]);
});
