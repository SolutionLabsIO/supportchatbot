import { isAuthenticated } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Protected routes that require authentication
  const protectedRoutes = [
    '/conversations',
    '/logs'
  ];

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    event.url.pathname === route || event.url.pathname.startsWith(`${route}/`)
  );

  // API routes that should remain public for webhooks
  const publicApiRoutes = [
    '/api/meta/webhook',
  ];

  const isPublicApiRoute = publicApiRoutes.some(route => 
    event.url.pathname === route || event.url.pathname.startsWith(`${route}/`)
  );

  // If this is a protected route and not authenticated, redirect to login
  if (isProtectedRoute && !isPublicApiRoute && !isAuthenticated(event.cookies)) {
    return new Response('Redirect', {
      status: 303,
      headers: { Location: `/login?redirectTo=${encodeURIComponent(event.url.pathname)}` }
    });
  }

  // Continue with the request
  return resolve(event);
}; 