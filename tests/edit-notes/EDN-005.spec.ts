import { test, expect } from '../fixtures';
import { archiveNote, createNote, getNotes } from '../utils/api';
import { uniqueNote } from '../utils/testdata';
import { expectToast, fillNoteEditor, noteCardById, noteEditor } from '../utils/ui';

/**
 * EDN-005 — Business rule: archived notes cannot be edited until restored.
 * Expected: read-only editor with a restriction banner; restoring makes it editable again.
 */
test('EDN-005 blocks editing an archived note until it is restored', async ({ appPage, user, request }) => {
  const original = uniqueNote({ category: 'Work' });
  const created = await createNote(request, user.token, original);
  await archiveNote(request, user.token, created.id);

  await appPage.reload();
  await appPage.locator('#filter-tab-archived').click();

  const card = noteCardById(appPage, created.id);
  await expect(card).toBeVisible();
  await expect(card).toHaveAttribute('data-archived', 'true');
  await expect(appPage.locator(`#badge-archived-${created.id}`)).toContainText('Archived (Read-Only)');

  await appPage.locator(`#btn-edit-note-${created.id}`).click();

  await expectToast(appPage, 'Archived notes cannot be edited. Restore the note first.');
  await expect(noteEditor(appPage)).toBeVisible();
  await expect(appPage.locator('#modal-title')).toHaveText('View Archived Note');
  await expect(appPage.locator('#archived-rule-warning')).toContainText('Archived notes cannot be edited');

  // Every field is locked and there is no way to save.
  await expect(appPage.locator('#input-note-title')).toBeDisabled();
  await expect(appPage.locator('#textarea-note-content')).toBeDisabled();
  await expect(appPage.locator('#select-note-category')).toBeDisabled();
  await expect(appPage.locator('#btn-save-note')).toHaveCount(0);
  await expect(appPage.locator('#btn-cancel-modal')).toHaveText('Close');

  // Restore from inside the modal.
  await appPage.locator('#btn-modal-restore').click();

  await expect(noteEditor(appPage)).toHaveCount(0);
  await expectToast(appPage, 'Note restored to Active Notes.');

  const [restored] = await getNotes(request, user.token);
  expect(restored.isArchived).toBe(false);

  // The note is editable again from the Active tab.
  await appPage.locator('#filter-tab-active').click();
  await appPage.locator(`#btn-edit-note-${created.id}`).click();

  await expect(appPage.locator('#modal-title')).toHaveText('Edit Note');
  await expect(appPage.locator('#input-note-title')).toBeEnabled();

  await fillNoteEditor(appPage, { title: `${original.title} (post-restore)` });
  await appPage.locator('#btn-save-note').click();

  await expectToast(appPage, 'Note updated successfully.');
  await expect(noteCardById(appPage, created.id)).toContainText('(post-restore)');
});
