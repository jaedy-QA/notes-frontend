import { test, expect } from '../fixtures';
import { uniqueNote } from '../utils/testdata';
import { expectToast, fillNoteEditor, noteCardByTitle, noteEditor } from '../utils/ui';

/**
 * CRN-001 — Create the first note from the empty state.
 * Expected: the note is saved and replaces the empty state in the grid.
 */
// [UNLINKED] test('CRN-001 creates the first note from the empty state', async ({ appPage }) => {
  // [UNLINKED] const note = uniqueNote({ category: 'Work' });
// [UNLINKED] 
  // [UNLINKED] await expect(appPage.locator('#empty-state')).toContainText('No notes yet');
  // [UNLINKED] await appPage.locator('#btn-empty-create-note').click();
// [UNLINKED] 
  // [UNLINKED] await expect(noteEditor(appPage)).toBeVisible();
  // [UNLINKED] await expect(appPage.locator('#modal-title')).toHaveText('Create New Note');
// [UNLINKED] 
  // [UNLINKED] await fillNoteEditor(appPage, note);
  // [UNLINKED] await appPage.locator('#btn-save-note').click();
// [UNLINKED] 
  // [UNLINKED] await expect(noteEditor(appPage)).toHaveCount(0);
  // [UNLINKED] await expectToast(appPage, 'New note created.');
// [UNLINKED] 
  // [UNLINKED] const card = noteCardByTitle(appPage, note.title);
  // [UNLINKED] await expect(card).toBeVisible();
  // [UNLINKED] await expect(card).toContainText(note.content);
  // [UNLINKED] await expect(card).toContainText(note.category);
  // [UNLINKED] await expect(appPage.locator('#empty-state')).toHaveCount(0);
// [UNLINKED] });
