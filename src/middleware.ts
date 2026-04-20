import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/sso-callback(.*)',
  '/api/webhooks(.*)',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, request) => {
  const authObj = await auth();
  const role = authObj.sessionClaims?.metadata?.role;

  // Protect Admin Routes
  if (isAdminRoute(request)) {
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Protect User Routes (Strict separation)
  const isUserRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/transactions(.*)',
    '/budgets(.*)',
    '/goals(.*)',
  ]);

  if (isUserRoute(request)) {
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin/overview', request.url));
    }
  }

  // Handle Root Redirect
  if (request.nextUrl.pathname === '/') {
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin/overview', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!isPublicRoute(request)) {
    if (!authObj.userId) {
      return authObj.redirectToSignIn();
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
