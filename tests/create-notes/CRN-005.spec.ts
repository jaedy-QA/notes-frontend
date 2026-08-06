import { test, expect } from '../fixtures';
import { getNotes } from '../utils/api';
import { uniqueNote } from '../utils/testdata';
import { expectToast, fillNoteEditor, noteCardByTitle, noteEditor } from '../utils/ui';

/**
 * CRN-005 — Content is optional and the new note is searchable straight away.
 * Expected: a title-only note saves, defaults to General, and matches a search query.
 */
test('CRN-005 creates a note with a title only and finds it via search', async ({ appPage, user, request }) => {
  const note = uniqueNote();

  await appPage.locator('#btn-new-note').click();
  await fillNoteEditor(appPage, { title: note.title });
  await appPage.locator('#btn-save-note').click();

  await expect(noteEditor(appPage)).toHaveCount(0);
  await expectToast(appPage, 'New note created.');

  const card = noteCardByTitle(appPage, note.title);
  await expect(card).toBeVisible();
  await expect(card).toContainText('General');

  const [saved] = await getNotes(request, user.token);
  expect(saved.content).toBe('');
  expect(saved.category).toBe('General');
  expect(saved.isArchived).toBe(false);

  // Search finds it.
  await appPage.locator('#input-search-notes').fill(note.title);
  await expect(appPage.locator('#search-results-pill')).toContainText(note.title);
  await expect(noteCardByTitle(appPage, note.title)).toBeVisible();

  // A query that matches nothing shows the empty search state.
  await appPage.locator('#input-search-notes').fill('no-such-note-xyz');
  await expect(appPage.locator('#empty-state')).toContainText('No matching notes found');
});
