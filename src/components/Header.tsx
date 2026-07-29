import React from 'react';
import { Search, Plus, Archive, CheckCircle, FolderOpen, LogOut, FileText, User } from 'lucide-react';
import { User as UserType } from '../../../shared-types/src/index.js';

interface HeaderProps {
  user: UserType;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: 'all' | 'active' | 'archived';
  onStatusFilterChange: (filter: 'all' | 'active' | 'archived') => void;
  onNewNoteClick: () => void;
  onLogout: () => void;
  activeCount: number;
  archivedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onNewNoteClick,
  onLogout,
  activeCount,
  archivedCount
}) => {
  return (
    <header id="app-header" className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        {/* Top Row: Brand, Search, Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-100">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-zinc-100 tracking-tight">Notes App</h1>
                <p className="text-xs text-zinc-400">Personal Workspace</p>
              </div>
            </div>

            {/* Mobile logout */}
            <button
              id="btn-mobile-logout"
              onClick={onLogout}
              className="sm:hidden text-zinc-400 hover:text-zinc-100 p-2 rounded-lg border border-zinc-800"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-notes"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search notes by title, content or tag..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
            />
            {searchQuery && (
              <button
                id="btn-clear-search"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
              >
                Clear
              </button>
            )}
          </div>

          {/* User Info & Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <div id="user-profile-badge" className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <span className="font-medium text-zinc-200">{user.name}</span>
            </div>

            <button
              id="btn-new-note"
              onClick={onNewNoteClick}
              className="bg-zinc-100 hover:bg-white text-zinc-950 font-medium px-3.5 py-2 rounded-lg text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Note</span>
            </button>

            <button
              id="btn-logout"
              onClick={onLogout}
              className="bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-zinc-100 p-2 rounded-lg text-sm transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Row: Filter Tabs and Mobile New Note Button */}
        <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between gap-2 overflow-x-auto">
          <div id="filter-tabs" className="flex items-center gap-1.5">
            <button
              id="filter-tab-active"
              onClick={() => onStatusFilterChange('active')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === 'active'
                  ? 'bg-zinc-100 text-zinc-950 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Active Notes</span>
              <span className="ml-1 px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 text-[10px]">
                {activeCount}
              </span>
            </button>

            <button
              id="filter-tab-archived"
              onClick={() => onStatusFilterChange('archived')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === 'archived'
                  ? 'bg-zinc-100 text-zinc-950 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Archived</span>
              <span className="ml-1 px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 text-[10px]">
                {archivedCount}
              </span>
            </button>

            <button
              id="filter-tab-all"
              onClick={() => onStatusFilterChange('all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-zinc-100 text-zinc-950 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <span>All Notes</span>
            </button>
          </div>

          <button
            id="btn-mobile-new-note"
            onClick={onNewNoteClick}
            className="sm:hidden bg-zinc-100 hover:bg-white text-zinc-950 font-medium px-3 py-1.5 rounded-md text-xs flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Note</span>
          </button>
        </div>
      </div>
    </header>
  );
};
