import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

const PUBLIC_ROUTES = ["/", "/auth/sign-in", "/auth/sign-up", "/unauthorized"];

// --- Rute Admin-Only ---
function isProtectedAdminRoute(pathname: string): boolean {
  const adminOnlySections = ["/dashboard/members", "/dashboard/settings"];
  const adminOnlyActions = [
    "/create",
    "/edit",
    "/delete",
    "/dashboard/attendances/create",
    "/dashboard/blogs/create",
  ];

  if (adminOnlySections.some((section) => pathname.startsWith(section))) {
    return true;
  }

  if (adminOnlyActions.some((action) => pathname.includes(action))) {
    return true;
  }

  if (pathname.startsWith("/dashboard/profile")) {
    return true;
  }

  return false;
}

function isProtectedRoute(pathname: string): boolean {
  if (pathname.startsWith("/dashboard")) {
    return true;
  }

  if (pathname.startsWith("/member/check-in")) {
    return true;
  }

  if (pathname.startsWith("/member/profile")) {
    return true;
  }

  return false;
}

interface CustomJwtPayload {
  role?: string;
  exp?: number;
  [key: string]: any;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  if (isProtectedRoute(pathname)) {
    const memberPortalUrl = new URL("/member/check-in", request.url);
    const unauthorizedUrl = new URL("/unauthorized", request.url);
    const loginUrl = new URL("/auth/sign-in", request.url);

    const token = request.cookies.get("refreshToken")?.value;

    if (!token) {
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      const userRole = decoded.role;

      const currentTime = Date.now() / 1000;
      if (decoded.exp && decoded.exp < currentTime) {
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete("refreshToken");
        return response;
      }

      if (pathname.startsWith("/auth")) {
        const redirectPath =
          userRole === "ADMIN" ? "/dashboard" : "/attendance/check-in";
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }

      if (isProtectedAdminRoute(pathname)) {
        if (userRole !== "ADMIN") {
          return NextResponse.redirect(unauthorizedUrl);
        }
      }

      if (pathname === "/dashboard" && userRole === "MEMBER") {
        return NextResponse.redirect(memberPortalUrl);
      }

      if (
        (pathname.startsWith("/attendance/check-in") ||
          pathname.startsWith("/member/profile")) &&
        userRole === "ADMIN"
      ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.error("Middleware Decode Error:", error);
      const url = new URL("/auth/sign-in", request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
