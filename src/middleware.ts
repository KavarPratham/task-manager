// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRoutes: ['/', '/sign-in(.*)?', '/sign-up(.*)?'],
});

export const config = {
  matcher: [
    // Match all routes except static files, _next, etc.
    "/((?!_next|.*\\..*).*)",
    // Always run middleware for API and TRPC routes
    "/(api|trpc)(.*)",
  ],
};
