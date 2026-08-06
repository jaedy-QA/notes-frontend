import { APIRequestContext, expect } from '@playwright/test';
import { newUser } from './testdata';

/**
 * Backend helpers. Requests go through the vite proxy (baseURL), so
 * /api/auth/* hits auth-service:3001 and /api/notes* hits notes-api:3002.
 */

export interface RegisteredUser {
  id: string;
  email: string;
  password: string;
  name: string;
  token: string;
}

export interface ApiNote {
  id: string;
  title: string;
  content: string;
  category: string;
  isArchived: boolean;
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

/** Creates a brand new account so each test owns an isolated, empty notes list. */
export async function registerUser(
  request: APIRequestContext,
  overrides: Partial<{ email: string; password: string; name: string }> = {}
): Promise<RegisteredUser> {
  const candidate = newUser(overrides);

  const res = await request.post('/api/auth/register', { data: candidate });
  expect(res.status(), `registration failed: ${await res.text()}`).toBe(201);

  const body = await res.json();
  return {
    id: body.data.user.id,
    email: candidate.email,
    password: candidate.password,
    name: candidate.name,
    token: body.data.token
  };
}

export async function loginViaApi(request: APIRequestContext, email: string, password: string): Promise<string> {
  const res = await request.post('/api/auth/login', { data: { email, password } });
  expect(res.ok(), `login failed: ${await res.text()}`).toBeTruthy();
  return (await res.json()).data.token;
}

export async function createNote(
  request: APIRequestContext,
  token: string,
  input: { title: string; content?: string; category?: string }
): Promise<ApiNote> {
  const res = await request.post('/api/notes', { headers: authHeaders(token), data: input });
  expect(res.status(), `note creation failed: ${await res.text()}`).toBe(201);
  return (await res.json()).data;
}

export async function archiveNote(request: APIRequestContext, token: string, id: string): Promise<ApiNote> {
  const res = await request.patch(`/api/notes/${id}/archive`, { headers: authHeaders(token) });
  expect(res.ok(), `archive failed: ${await res.text()}`).toBeTruthy();
  return (await res.json()).data;
}

export async function getNotes(
  request: APIRequestContext,
  token: string,
  status: 'active' | 'archived' | 'all' = 'all'
): Promise<ApiNote[]> {
  const res = await request.get(`/api/notes?status=${status}`, { headers: authHeaders(token) });
  expect(res.ok(), `fetch notes failed: ${await res.text()}`).toBeTruthy();
  return (await res.json()).data;
}
