/**
 * Unsaved editor drafts, persisted to localStorage.
 *
 * Keys are namespaced per user so drafts never leak between accounts sharing a
 * browser: `notes_draft_{userId}_{noteId}`, or `notes_draft_{userId}_new` for
 * the create-note form.
 */

const DRAFT_PREFIX = 'notes_draft';

export interface NoteDraft {
  title: string;
  content: string;
  category: string;
  /** ISO timestamp of the autosave, for the recovery prompt. */
  savedAt: string;
  /** `note.updatedAt` when editing began; absent for a new note. */
  baseUpdatedAt?: string;
}

export function draftKey(userId: string, noteId?: string): string {
  return `${DRAFT_PREFIX}_${userId}_${noteId ?? 'new'}`;
}

/**
 * Returns false when the draft could not be stored (quota exceeded, storage
 * disabled). Autosave is best-effort — a failed write must never interrupt
 * editing or saving.
 */
export function writeDraft(userId: string, noteId: string | undefined, draft: NoteDraft): boolean {
  try {
    localStorage.setItem(draftKey(userId, noteId), JSON.stringify(draft));
    return true;
  } catch {
    return false;
  }
}
