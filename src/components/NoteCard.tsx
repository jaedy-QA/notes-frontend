import React from 'react';
import { Edit2, Archive, RotateCcw, Trash2, Calendar, Tag, AlertTriangle } from 'lucide-react';
import { Note } from '../../../shared-types/src/index.js';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onArchive,
  onRestore,
  onDelete
}) => {
  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div
      id={`note-card-${note.id}`}
      data-note-id={note.id}
      data-archived={note.isArchived}
      className={`bg-zinc-900 border rounded-xl p-5 flex flex-col justify-between transition-all duration-150 ${
        note.isArchived
          ? 'border-zinc-800/80 bg-zinc-900/50 opacity-80'
          : 'border-zinc-800 hover:border-zinc-700'
      }`}
    >
      <div>
        {/* Top bar: Category badge & status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-zinc-800 text-zinc-300 px-2.5 py-0.5 rounded-md border border-zinc-700/50">
            <Tag className="w-3 h-3 text-zinc-400" />
            {note.category}
          </span>

          {note.isArchived && (
            <span id={`badge-archived-${note.id}`} className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-950/60 text-amber-300 border border-amber-800/50 px-2 py-0.5 rounded-md">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              Archived (Read-Only)
            </span>
          )}
        </div>

        {/* Note Title */}
        <h3 id={`note-title-${note.id}`} className="text-base font-semibold text-zinc-100 mb-2 line-clamp-2">
          {note.title}
        </h3>

        {/* Note Content */}
        <p id={`note-content-${note.id}`} className="text-sm text-zinc-400 whitespace-pre-line line-clamp-4 leading-relaxed mb-4">
          {note.content}
        </p>
      </div>

      {/* Footer & Controls */}
      <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2 text-xs text-zinc-500">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(note.updatedAt)}
        </span>

        <div className="flex items-center gap-1">
          {/* Edit button */}
          <button
            id={`btn-edit-note-${note.id}`}
            onClick={() => onEdit(note)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              note.isArchived
                ? 'text-zinc-600 border-zinc-800 hover:text-amber-400 hover:border-amber-800/60'
                : 'text-zinc-300 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-100'
            }`}
            title={note.isArchived ? 'Archived notes cannot be edited' : 'Edit note'}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          {/* Archive / Restore button */}
          {note.isArchived ? (
            <button
              id={`btn-restore-note-${note.id}`}
              onClick={() => onRestore(note.id)}
              className="p-1.5 text-zinc-300 hover:text-emerald-300 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors cursor-pointer"
              title="Restore note"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              id={`btn-archive-note-${note.id}`}
              onClick={() => onArchive(note.id)}
              className="p-1.5 text-zinc-300 hover:text-amber-300 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors cursor-pointer"
              title="Archive note"
            >
              <Archive className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Delete button */}
          <button
            id={`btn-delete-note-${note.id}`}
            onClick={() => onDelete(note.id)}
            className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors cursor-pointer"
            title="Delete note"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
