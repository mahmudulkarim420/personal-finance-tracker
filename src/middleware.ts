import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/sso-callback(.*)',
  '/api/webhooks(.*)',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

const isUserRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/transactions(.*)',
  '/budgets(.*)',
  '/goals(.*)',
  '/settings(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  const authObj = await auth();

  // ── Step 1: Let unauthenticated users through to public routes ──────────────
  if (isPublicRoute(request)) return NextResponse.next();

  // ── Step 2: Redirect unauthenticated users to sign-in ──────────────────────
  if (!authObj.userId) {
    return authObj.redirectToSignIn();
  }

  // ── Step 3: Role-based routing ──────────────────────────────────────────────
  // NOTE: sessionClaims.metadata.role is used here for SPEED at the edge layer
  // (Middleware runs before any DB call is possible). This is acceptable because:
  //   a) Admin promotion is an infrequent operation.
  //   b) Each individual page & server action performs a secondary DB-based
  //      role check as the definitive "source of truth" guard.
  // If a role change doesn't reflect immediately, the user must sign out and
  // sign back in to refresh their Clerk session token.
  const role = authObj.sessionClaims?.metadata?.role as string | undefined;

  // Protect Admin Routes — block non-admins
  if (isAdminRoute(request)) {
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Protect User Routes — redirect admins away from standard pages
  if (isUserRoute(request)) {
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin/overview', request.url));
    }
  }

  // ── Step 4: Root redirect ───────────────────────────────────────────────────
  if (request.nextUrl.pathname === '/') {
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin/overview', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
