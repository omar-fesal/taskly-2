import axios from "axios";
import { AuthService } from "./AuthService";

const AxiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BACK_END_URL,
	timeout: 60_000, // 1 minute
	headers: {
		"Content-Type": "application/json",
		apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
	},
});

AxiosInstance.interceptors.request.use((config) => {
	const token = AuthService.getRefreshToken();

	config.headers = config.headers || {};

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

AxiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error?.response?.status === 401) {
			AuthService.clearSession();
			if (window !== undefined) {
				window.location.href = "/login";
			}
		}

		return Promise.reject(error);
	},
);
export default AxiosInstance;
