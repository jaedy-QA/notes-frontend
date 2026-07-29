import React, { useState, useEffect } from 'react';
import { X, Save, AlertTriangle, RotateCcw } from 'lucide-react';
import { Note, NOTE_CATEGORIES, NoteCategory } from '../../../shared-types/src/index.js';

interface NoteEditorModalProps {
  isOpen: boolean;
  note: Note | null;
  onClose: () => void;
  onSave: (data: { title: string; content: string; category: string }) => Promise<void>;
  onRestore?: (id: string) => Promise<void>;
}

export const NoteEditorModal: React.FC<NoteEditorModalProps> = ({
  isOpen,
  note,
  onClose,
  onSave,
  onRestore
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoteCategory>('General');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isArchived = note?.isArchived || false;

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCategory((note.category as NoteCategory) || 'General');
    } else {
      setTitle('');
      setContent('');
      setCategory('General');
    }
    setErrorMsg('');
  }, [note, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isArchived) {
      setErrorMsg('Archived notes cannot be edited. Please restore the note first.');
      return;
    }

    if (!title.trim()) {
      setErrorMsg('Title is required.');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    try {
      await onSave({ title, content, category });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleRestoreClick = async () => {
    if (note && onRestore) {
      setSaving(true);
      try {
        await onRestore(note.id);
        onClose();
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to restore note');
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div id="modal-note-editor" className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div id="modal-content" className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <h2 id="modal-title" className="text-base font-bold text-zinc-100">
            {note ? (isArchived ? 'View Archived Note' : 'Edit Note') : 'Create New Note'}
          </h2>
          <button
            id="btn-close-modal"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Archived Warning Banner */}
          {isArchived && (
            <div id="archived-rule-warning" className="p-4 bg-amber-950/40 border border-amber-800/60 rounded-lg text-amber-200 text-xs flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-300">Business Rule Restriction</p>
                  <p className="mt-0.5 text-amber-200/80">
                    Archived notes cannot be edited. You can view the contents or restore it to make changes.
                  </p>
                </div>
              </div>
              {onRestore && (
                <button
                  id="btn-modal-restore"
                  type="button"
                  onClick={handleRestoreClick}
                  disabled={saving}
                  className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-medium px-2.5 py-1 rounded text-xs shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restore</span>
                </button>
              )}
            </div>
          )}

          {/* Validation error message */}
          {errorMsg && (
            <div id="modal-error-banner" className="p-3 bg-red-950/50 border border-red-800/50 rounded-lg text-red-200 text-xs">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Title
            </label>
            <input
              id="input-note-title"
              type="text"
              disabled={isArchived}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weekly QA Meeting Notes"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 disabled:opacity-60 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Category
            </label>
            <select
              id="select-note-category"
              disabled={isArchived}
              value={category}
              onChange={(e) => setCategory(e.target.value as NoteCategory)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-zinc-500 disabled:opacity-60 transition-colors"
            >
              {NOTE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Content
            </label>
            <textarea
              id="textarea-note-content"
              disabled={isArchived}
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note details here..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 disabled:opacity-60 transition-colors resize-y"
            />
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              id="btn-cancel-modal"
              type="button"
              onClick={onClose}
              className="bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-medium px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
            >
              {isArchived ? 'Close' : 'Cancel'}
            </button>

            {!isArchived && (
              <button
                id="btn-save-note"
                type="submit"
                disabled={saving}
                className="bg-zinc-100 hover:bg-white text-zinc-950 font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Note'}</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
