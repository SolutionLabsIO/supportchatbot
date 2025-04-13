import { dev } from '$app/environment';
import type { Cookies } from '@sveltejs/kit';

// Authentication credentials should be set in .env
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || (dev ? 'password' : '');
const SESSION_SECRET = process.env.SESSION_SECRET || (dev ? 'dev_secret_key' : '');

// Session expiration time (24 hours)
const SESSION_EXPIRY = 24 * 60 * 60 * 1000;

// A simple cookie-based authentication system
export function authenticateUser(username: string, password: string): boolean {
  // In production, ensure proper credentials are set
  if (!dev && (!ADMIN_PASSWORD || ADMIN_PASSWORD === 'password')) {
    console.error('Warning: Default admin password used in production!');
    return false;
  }
  
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

// Create a session cookie
export function createSession(cookies: Cookies): void {
  const expiry = new Date(Date.now() + SESSION_EXPIRY);
  const sessionId = generateSessionId();
  
  cookies.set('scholistico_session', sessionId, {
    path: '/',
    httpOnly: true,
    secure: !dev,
    sameSite: 'strict',
    expires: expiry
  });
}

// Check if the session is valid
export function isAuthenticated(cookies: Cookies): boolean {
  const sessionId = cookies.get('scholistico_session');
  return !!sessionId; // Simple check - in a real app, validate the session
}

// Remove the session
export function clearSession(cookies: Cookies): void {
  cookies.delete('scholistico_session', { path: '/' });
}

// Generate a simple session ID
function generateSessionId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
} 