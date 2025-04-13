import { clearSession } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export function GET({ cookies }: RequestEvent) {
  clearSession(cookies);
  throw redirect(303, '/login');
} 