import React, { useState, useEffect, useCallback } from 'react';
import { User, Note } from '../../shared-types/src/index.js';
import { authClient } from './api/authClient.js';
import { notesClient } from './api/notesClient.js';
import { AuthForm } from './components/AuthForm.tsx';
import { Header } from './components/Header.tsx';
import { NoteCard } from './components/NoteCard.tsx';
import { NoteEditorModal } from './components/NoteEditorModal.tsx';
import { ToastContainer, ToastMessage } from './components/Toast.tsx';
import { FileText, Plus, SearchX } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('active');

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'error' | 'success' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 1. Initial auth check
  useEffect(() => {
    authClient.getCurrentUser().then((u) => {
      setUser(u);
      setLoadingUser(false);
    });
  }, []);

  // 2. Fetch notes
  const fetchNotes = useCallback(async () => {
    if (!user) return;
    setLoadingNotes(true);
    try {
      const fetched = await notesClient.getNotes({
        search: searchQuery,
        status: statusFilter
      });
      setNotes(fetched);
    } catch (err: any) {
      addToast('error', err.message || 'Failed to load notes');
    } finally {
      setLoadingNotes(false);
    }
  }, [user, searchQuery, statusFilter]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Auth Handlers
  const handleAuthSuccess = (u: User) => {
    setUser(u);
    addToast('success', `Welcome back, ${u.name}!`);
  };

  const handleLogout = async () => {
    await authClient.logout();
    setUser(null);
    setNotes([]);
    addToast('info', 'You have been logged out.');
  };

  // Note Actions
  const handleOpenCreateModal = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  const handleOpenEditModal = (note: Note) => {
    if (note.isArchived) {
      addToast('error', 'Archived notes cannot be edited. Restore the note first.');
    }
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleSaveNote = async (data: { title: string; content: string; category: string }) => {
    if (editingNote) {
      await notesClient.updateNote(editingNote.id, data);
      addToast('success', 'Note updated successfully.');
    } else {
      await notesClient.createNote(data);
      addToast('success', 'New note created.');
    }
    fetchNotes();
  };

  const handleArchiveNote = async (id: string) => {
    try {
      await notesClient.archiveNote(id);
      addToast('success', 'Note moved to Archive.');
      fetchNotes();
    } catch (err: any) {
      addToast('error', err.message || 'Failed to archive note.');
    }
  };

  const handleRestoreNote = async (id: string) => {
    try {
      await notesClient.restoreNote(id);
      addToast('success', 'Note restored to Active Notes.');
      fetchNotes();
    } catch (err: any) {
      addToast('error', err.message || 'Failed to restore note.');
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await notesClient.deleteNote(id);
      addToast('info', 'Note deleted.');
      fetchNotes();
    } catch (err: any) {
      addToast('error', err.message || 'Failed to delete note.');
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
          <span>Loading Notes Application...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <AuthForm
          onSuccess={handleAuthSuccess}
          onError={(msg) => addToast('error', msg)}
        />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  const activeCount = notes.filter((n) => !n.isArchived).length;
  const archivedCount = notes.filter((n) => n.isArchived).length;

  return (
    <div id="app-root" className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-zinc-100">
      <Header
        user={user}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onNewNoteClick={handleOpenCreateModal}
        onLogout={handleLogout}
        activeCount={activeCount}
        archivedCount={archivedCount}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <h2 id="section-title" className="text-lg font-bold text-zinc-100 capitalize">
              {statusFilter === 'all' ? 'All Notes' : statusFilter === 'active' ? 'Active Notes' : 'Archived Notes'}
            </h2>
            {searchQuery && (
              <span id="search-results-pill" className="text-xs bg-zinc-900 border border-zinc-800 text-zinc-400 px-2.5 py-1 rounded-md">
                Query: "{searchQuery}"
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500">
            Showing {notes.length} {notes.length === 1 ? 'note' : 'notes'}
          </p>
        </div>

        {loadingNotes ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 h-44 animate-pulse flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-20 h-4 bg-zinc-800 rounded" />
                  <div className="w-3/4 h-5 bg-zinc-800 rounded" />
                  <div className="w-full h-12 bg-zinc-800/60 rounded" />
                </div>
                <div className="w-1/3 h-4 bg-zinc-800 rounded" />
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div id="empty-state" className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto my-12">
            {searchQuery ? (
              <>
                <SearchX className="w-10 h-10 text-zinc-600 mb-3" />
                <h3 className="text-base font-semibold text-zinc-200">No matching notes found</h3>
                <p className="text-xs text-zinc-500 mt-1 mb-4">
                  No notes match "{searchQuery}". Remember that deleted notes do not appear in search results.
                </p>
                <button
                  id="btn-empty-clear-search"
                  onClick={() => setSearchQuery('')}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Clear Search Filter
                </button>
              </>
            ) : statusFilter === 'archived' ? (
              <>
                <FileText className="w-10 h-10 text-zinc-600 mb-3" />
                <h3 className="text-base font-semibold text-zinc-200">No archived notes</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  You have not archived any notes yet.
                </p>
              </>
            ) : (
              <>
                <FileText className="w-10 h-10 text-zinc-600 mb-3" />
                <h3 className="text-base font-semibold text-zinc-200">No notes yet</h3>
                <p className="text-xs text-zinc-500 mt-1 mb-4">
                  Get started by creating your first personal note.
                </p>
                <button
                  id="btn-empty-create-note"
                  onClick={handleOpenCreateModal}
                  className="bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Note</span>
                </button>
              </>
            )}
          </div>
        ) : (
          <div id="notes-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleOpenEditModal}
                onArchive={handleArchiveNote}
                onRestore={handleRestoreNote}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        )}
      </main>

      <NoteEditorModal
        isOpen={isEditorOpen}
        note={editingNote}
        userId={user.id}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveNote}
        onRestore={handleRestoreNote}
      />

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
