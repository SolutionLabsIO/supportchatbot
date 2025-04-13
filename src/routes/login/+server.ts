import { authenticateUser, createSession } from '$lib/server/auth';
import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request, cookies }: RequestEvent) {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return json({ success: false, message: 'Username and password are required' }, { status: 400 });
    }
    
    if (authenticateUser(username, password)) {
      createSession(cookies);
      return json({ success: true });
    }
    
    return json({ success: false, message: 'Invalid username or password' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return json({ success: false, message: 'An error occurred during login' }, { status: 500 });
  }
} 