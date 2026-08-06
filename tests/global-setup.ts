import { request } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

/**
 * `webServer` only waits for vite to answer on 5173, but the two backend
 * services behind the vite proxy may still be booting. Both endpoints below
 * answer 401 as soon as their service is up, so a 401 means "ready".
 */
async function waitForService(name: string, path: string, deadline: number) {
  const ctx = await request.newContext({ baseURL: BASE_URL });
  try {
    while (Date.now() < deadline) {
      try {
        const res = await ctx.get(path);
        if (res.status() === 401) return;
      } catch {
        // proxy target refused the connection — service not up yet
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    throw new Error(`${name} was not reachable through ${BASE_URL}${path} in time.`);
  } finally {
    await ctx.dispose();
  }
}

export default async function globalSetup() {
  const deadline = Date.now() + 90_000;
  await waitForService('auth-service', '/api/auth/me', deadline);
  await waitForService('notes-api', '/api/notes', deadline);
}
