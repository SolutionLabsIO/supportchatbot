import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { isAuthenticated } from '$lib/server/auth';

export const load = async ({ cookies }: RequestEvent) => {
  if (isAuthenticated(cookies)) {
    // If authenticated, redirect to conversations
    throw redirect(302, '/conversations');
  } else {
    // If not authenticated, redirect to login
    throw redirect(302, '/login');
  }
}; 