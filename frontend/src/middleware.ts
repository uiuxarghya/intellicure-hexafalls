import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // Adjust the import path as necessary

import { betterFetch } from "@better-fetch/fetch";

type Session = typeof auth.$Infer.Session;

const authRoutes = ["/login", "/register"];
const protectedRoutes = [
  "/dashboard",
  "/appointments",
  "/records",
  "/arthamed",
  "/smritiyan",
  "/shwaas-veda",
  "/neuro-setu",
  "/settings",
  "/help",
];

export default async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const isAuthRoute = authRoutes.includes(pathName);
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathName.startsWith(route)
  );

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "", // Forward cookies from the request
      },
    }
  );

  if (!session) {
    if (isAuthRoute) {
      return NextResponse.next();
    }
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
