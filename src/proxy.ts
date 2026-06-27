import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE = "portfolio_auth";
const LOGIN_PATH = "/admin/login";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only guard /admin routes
    // if (!pathname.startsWith("/admin")) {
    //     return NextResponse.next();
    // }

    if (pathname === LOGIN_PATH) {
        return NextResponse.next();
    }
    // Always allow the login page through — use startsWith to handle
    // trailing slashes or query strings safely
    // if (pathname.startsWith(LOGIN_PATH)) {
    //     return NextResponse.next();
    // }

    // Check for the auth cookie — if it exists and has a value we let
    // the server-side session helper do the real JWT verification.
    // The proxy just prevents the redirect loop by only redirecting when
    // the cookie is entirely absent.
    const token = request.cookies.get(AUTH_COOKIE)?.value;

    if (!token) {
        const loginUrl = new URL(LOGIN_PATH, request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths starting with /admin
         * except for static files (_next/static, _next/image, favicon.ico)
         */
        "/admin/:path*",
    ],
};
