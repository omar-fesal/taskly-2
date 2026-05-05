// src/lib/auth.ts
import type { IUser, LoginResponse } from "@/types/loginResponse.type";
import { parseCookies, setCookie, destroyCookie } from "nookies";

export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const USER_KEY = "user";

export const AuthService = {
	// -------------------------------
	// Save login data (tokens + user)
	// -------------------------------
	setSession(data: LoginResponse) {
		setCookie(null, ACCESS_TOKEN_KEY, data[ACCESS_TOKEN_KEY], {
			path: "/",
			maxAge: 60 * 60 * 24 * 7, // 7 days
		});

		setCookie(null, REFRESH_TOKEN_KEY, data[REFRESH_TOKEN_KEY], {
			path: "/",
			maxAge: 60 * 60 * 24 * 7, // 7 days
		});

		setCookie(null, USER_KEY, JSON.stringify(data.user), {
			path: "/",
			maxAge: 60 * 60 * 24 * 30, // 30 days
		});

		localStorage.setItem(USER_KEY, JSON.stringify(data?.user));
	},

	// -------------------------------
	// Remove session (logout)
	// -------------------------------
	clearSession() {
		destroyCookie(null, ACCESS_TOKEN_KEY, { path: "/" });
		destroyCookie(null, REFRESH_TOKEN_KEY, { path: "/" });
		destroyCookie(null, USER_KEY, { path: "/" });
		localStorage.removeItem(USER_KEY);
	},

	// -------------------------------
	// Get access token
	// -------------------------------
	getAccessToken(ctx?: any) {
		const cookies = parseCookies(ctx);
		return cookies[ACCESS_TOKEN_KEY] || null;
	},

	// -------------------------------
	// Get refresh token
	// -------------------------------
	getRefreshToken(ctx?: any) {
		const cookies = parseCookies(ctx);
		return cookies[REFRESH_TOKEN_KEY] || null;
	},

	// -------------------------------
	// Get user object
	// -------------------------------
	getUser(ctx?: any): IUser | null {
		const cookies = parseCookies(ctx);
		const saved = localStorage.getItem(USER_KEY);
		return saved ? JSON.parse(saved) : null;
	},

	// -------------------------------
	// Check login state
	// -------------------------------
	updateTokens(access_token: string, refresh_token: string) {
		setCookie(null, ACCESS_TOKEN_KEY, access_token, {
			path: "/",
			maxAge: 60 * 60 * 24 * 7, // 7 days
		});

		setCookie(null, REFRESH_TOKEN_KEY, refresh_token, {
			path: "/",
			maxAge: 60 * 60 * 24 * 30, // 30 days
		});
	},
};
