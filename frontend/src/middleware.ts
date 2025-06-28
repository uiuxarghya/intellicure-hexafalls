import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Middleware to enforce authentication globally
export async function middleware(request: NextRequest) {
  const session = await getSessionCookie(request);

  // Paths that should be publicly accessible even without a session
  const publicPaths = [
    "/",
    "/_next", // Next.js internals
    "/api/auth", // Auth API routes
    "/favicon.ico",
    "/public",
  ];

  // Check if the requested path is public
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Redirect to "/" if not authenticated and not on a public path
  if (!session && !isPublicPath) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("redirected", "true");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Config to apply middleware to all routes except static files and auth
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth|public).*)"],
};
