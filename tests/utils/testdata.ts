/**
 * Static and generated test data for the Notes App suite.
 */

/** Seeded in auth-service/src/userStore.ts */
export const DEMO_USER = {
  email: 'demo@example.com',
  password: 'password123',
  name: 'Demo User'
};

/** Seeded in auth-service/src/userStore.ts */
export const QA_USER = {
  email: 'test@qa.com',
  password: 'testonly',
  name: 'Northqa'
};

export const VALID_PASSWORD = 'Passw0rd123';

export const NOTE_CATEGORIES = ['General', 'Work', 'Personal', 'Ideas', 'Tasks'] as const;

let sequence = 0;

/** Unique per worker/run so parallel tests never collide in the in-memory store. */
export function uniqueEmail(prefix = 'qa'): string {
  const stamp = `${Date.now()}${sequence++}${Math.random().toString(36).slice(2, 7)}`;
  return `${prefix}.${stamp}@northqa.test`;
}

export function newUser(overrides: Partial<{ email: string; password: string; name: string }> = {}) {
  return {
    email: uniqueEmail(),
    password: VALID_PASSWORD,
    name: 'QA Tester',
    ...overrides
  };
}

export function uniqueNote(overrides: Partial<{ title: string; content: string; category: string }> = {}) {
  const stamp = `${Date.now()}${sequence++}`;
  return {
    title: `Automated Note ${stamp}`,
    content: `Body created by Playwright at ${new Date().toISOString()}`,
    category: 'General',
    ...overrides
  };
}
