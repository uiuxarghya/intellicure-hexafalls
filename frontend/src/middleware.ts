import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

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

  const session = await auth.api.getSession({
    headers: await headers(),
  });

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
