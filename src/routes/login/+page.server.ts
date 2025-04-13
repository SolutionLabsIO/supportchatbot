import { authenticateUser, createSession, isAuthenticated } from '$lib/server/auth';
import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, url }) => {
  // If already authenticated, redirect to homepage
  if (isAuthenticated(cookies)) {
    throw redirect(303, url.searchParams.get('redirectTo') || '/');
  }
  
  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const username = data.get('username')?.toString() || '';
    const password = data.get('password')?.toString() || '';
    
    if (!username || !password) {
      return fail(400, { 
        error: 'Username and password are required',
        username 
      });
    }
    
    if (authenticateUser(username, password)) {
      createSession(cookies);
      return { success: true };
    }
    
    return fail(401, { 
      error: 'Invalid username or password',
      username 
    });
  }
}; 