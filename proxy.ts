import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface CustomJwtPayload {
  role?: string;
  sub?: string;
  exp?: number;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  console.log(`--- Middleware Checking: ${pathname} ---`);

  if (!token) {
    console.log("No token found in cookies.");
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/member")) {
      console.log("Redirecting to /unauthorized (No Token)");
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    return NextResponse.next();
  }

  try {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    const userRole = decoded.role;

    console.log(`Token valid. User Role: [${userRole}]`);

    if (pathname.startsWith("/dashboard")) {
      if (userRole !== "ADMIN") {
        console.log(
          `Access Denied to Dashboard: Role is ${userRole}, expected ADMIN`
        );
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    if (pathname.startsWith("/member")) {
      if (userRole !== "MEMBER") {
        console.log(
          `Access Denied to Member Area: Role is ${userRole}, expected MEMBER`
        );
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    if (pathname.startsWith("/auth")) {
      console.log("User already logged in. Redirecting away from Auth page.");
      const redirectUrl =
        userRole === "ADMIN" ? "/dashboard" : "/member/check-in";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    console.log("Access Granted.");
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware Auth Error (Token Corrupt?):", error);
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/member/:path*", "/auth/:path*"],
};
