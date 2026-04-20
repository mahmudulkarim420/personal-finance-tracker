import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { UserRole } from "@/types/roles";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/sso-callback(.*)",
  "/api/webhooks(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

const isUserRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/transactions(.*)",
  "/budgets(.*)",
  "/goals(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (isPublicRoute(request)) {
    return;
  }

  await auth.protect();

  const { sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role as UserRole | undefined;
  const pathname = request.nextUrl.pathname;

  if (pathname === "/") {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin/overview", request.url));
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAdminRoute(request) && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isUserRoute(request) && role === "admin") {
    return NextResponse.redirect(new URL("/admin/overview", request.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
