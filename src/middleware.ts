// middleware.ts
import { clerkMiddleware, createRouteMatcher  } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(['/','/dashboard', '/about' ,'/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Match all routes except static files, _next, etc.
    "/((?!_next|.*\\..*).*)",
    // Always run middleware for API and TRPC routes
    "/(api|trpc)(.*)",
  ],
};
