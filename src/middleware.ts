import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./lib/AuthService";

export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	const accessToken = req.cookies.get(ACCESS_TOKEN_KEY)?.value;
	const refreshToken = req.cookies.get(REFRESH_TOKEN_KEY)?.value;

	const isAuth = !!(accessToken || refreshToken);

	const isAuthPage = pathname === "/login" || pathname === "/register";
	const isBase = pathname === "/";

	if (isBase) {
		if (!isAuth) {
			return NextResponse.redirect(new URL("/login", req.url));
		} else {
			return NextResponse.redirect(new URL("/dashboard", req.url));
		}
	}
	if (!isAuth && !isAuthPage) {
		// -----------------------------------
		// ❌ NOT AUTH → redirect to login
		// -----------------------------------
		return NextResponse.redirect(new URL("/login", req.url));
	}
	if (isAuth && isAuthPage) {
		return NextResponse.redirect(new URL("/dashboard", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
