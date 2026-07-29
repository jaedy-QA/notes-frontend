import { Note, CreateNoteInput, UpdateNoteInput } from '../../../shared-types/src/index.js';
import { authClient } from './authClient.js';

function getAuthHeaders(): Record<string, string> {
  const token = authClient.getToken();
  if (!token) {
    throw new Error('Authentication required');
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

export const notesClient = {
  async getNotes(params?: { search?: string; status?: 'active' | 'archived' | 'all' }): Promise<Note[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);

    const res = await fetch(`/api/notes?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to fetch notes');
    }
    return json.data;
  },

  async createNote(input: CreateNoteInput): Promise<Note> {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(input)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to create note');
    }
    return json.data;
  },

  async updateNote(id: string, input: UpdateNoteInput): Promise<Note> {
    const res = await fetch(`/api/notes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(input)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to update note');
    }
    return json.data;
  },

  async archiveNote(id: string): Promise<Note> {
    const res = await fetch(`/api/notes/${id}/archive`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to archive note');
    }
    return json.data;
  },

  async restoreNote(id: string): Promise<Note> {
    const res = await fetch(`/api/notes/${id}/restore`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to restore note');
    }
    return json.data;
  },

  async deleteNote(id: string): Promise<void> {
    const res = await fetch(`/api/notes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to delete note');
    }
  }
};
