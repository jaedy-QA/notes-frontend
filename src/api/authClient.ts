import { RegisterRequest, LoginRequest, AuthSession, User } from '../../../shared-types/src/index.js';

const TOKEN_KEY = 'notes_auth_token';

export const authClient = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  async register(data: RegisterRequest): Promise<AuthSession> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Registration failed');
    }
    this.setToken(json.data.token);
    return json.data;
  },

  async login(data: LoginRequest): Promise<AuthSession> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Login failed');
    }
    this.setToken(json.data.token);
    return json.data;
  },

  async getCurrentUser(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        this.clearToken();
        return null;
      }
      return json.data.user;
    } catch {
      this.clearToken();
      return null;
    }
  },

  async logout(): Promise<void> {
    const token = this.getToken();
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch {
        // Ignore errors on logout
      }
    }
    this.clearToken();
  }
};
