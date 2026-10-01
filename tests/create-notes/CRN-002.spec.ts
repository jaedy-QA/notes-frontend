import { test, expect } from '../fixtures';
import { uniqueNote } from '../utils/testdata';
import { expectToast, fillNoteEditor, noteCardByTitle, noteEditor, notesGrid } from '../utils/ui';

/**
 * CRN-002 — Create notes from the header "New Note" button, one per category.
 * Expected: every note is created and shows its own category badge.
 */
test('CRN-002 creates notes from the header button for each category', async ({ appPage }) => {
  const categories = ['General', 'Personal', 'Ideas', 'Tasks'];
  const created: string[] = [];

  for (const category of categories) {
    const note = uniqueNote({ category });

    await appPage.locator('#btn-new-note').click();
    await expect(noteEditor(appPage)).toBeVisible();

    await fillNoteEditor(appPage, note);
    await appPage.locator('#btn-save-note').click();

    await expect(noteEditor(appPage)).toHaveCount(0);
    await expectToast(appPage, 'New note created.');

    const card = noteCardByTitle(appPage, note.title);
    await expect(card).toBeVisible();
    await expect(card).toContainText(category);

    created.push(note.title);
  }

  await expect(notesGrid(appPage).locator('[data-note-id]')).toHaveCount(created.length);
  await expect(appPage.locator('#filter-tab-active')).toContainText(String(created.length));
});
