import { test, expect } from '../fixtures';
import { uniqueNote } from '../utils/testdata';
import { expectToast, fillNoteEditor, noteCardByTitle, noteEditor, notesGrid } from '../utils/ui';

/**
 * CRN-002 — Create notes from the header "New Note" button, one per category.
 * Expected: every note is created and shows its own category badge.
 */
// [UNLINKED] test('CRN-002 creates notes from the header button for each category', async ({ appPage }) => {
  // [UNLINKED] const categories = ['General', 'Personal', 'Ideas', 'Tasks'];
  // [UNLINKED] const created: string[] = [];
// [UNLINKED] 
  // [UNLINKED] for (const category of categories) {
    // [UNLINKED] const note = uniqueNote({ category });
// [UNLINKED] 
    // [UNLINKED] await appPage.locator('#btn-new-note').click();
    // [UNLINKED] await expect(noteEditor(appPage)).toBeVisible();
// [UNLINKED] 
    // [UNLINKED] await fillNoteEditor(appPage, note);
    // [UNLINKED] await appPage.locator('#btn-save-note').click();
// [UNLINKED] 
    // [UNLINKED] await expect(noteEditor(appPage)).toHaveCount(0);
    // [UNLINKED] await expectToast(appPage, 'New note created.');
// [UNLINKED] 
    // [UNLINKED] const card = noteCardByTitle(appPage, note.title);
    // [UNLINKED] await expect(card).toBeVisible();
    // [UNLINKED] await expect(card).toContainText(category);
// [UNLINKED] 
    // [UNLINKED] created.push(note.title);
  // [UNLINKED] }
// [UNLINKED] 
  // [UNLINKED] await expect(notesGrid(appPage).locator('[data-note-id]')).toHaveCount(created.length);
  // [UNLINKED] await expect(appPage.locator('#filter-tab-active')).toContainText(String(created.length));
// [UNLINKED] });
