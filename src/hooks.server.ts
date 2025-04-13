import { isAuthenticated } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Public routes that don't require authentication
  const publicRoutes = [
    '/login',
    '/privacy',
    '/terms',
    '/api/meta/webhook',
    '/api/meta/data-deletion'
  ];

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => 
    event.url.pathname === route || event.url.pathname.startsWith(`${route}/`)
  );

  // If not a public route and not authenticated, redirect to login
  if (!isPublicRoute && !isAuthenticated(event.cookies)) {
    // Home page should redirect to login
    if (event.url.pathname === '/') {
      return new Response('Redirect', {
        status: 303,
        headers: { Location: '/login' }
      });
    }
    
    // Other protected routes
    return new Response('Redirect', {
      status: 303,
      headers: { Location: `/login?redirectTo=${encodeURIComponent(event.url.pathname)}` }
    });
  }

  // Continue with the request
  return resolve(event);
}; 