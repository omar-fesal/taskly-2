import AxiosInstance from "@/lib/AxiosBase";

export type LoginActionPayload = {
    email: string;
    password: string;
};

export async function LoginAction(data: LoginActionPayload) {
    try {
        const response = await AxiosInstance.post(
            "/auth/v1/token?grant_type=password",
            {
                email: data.email,
                password: data.password,
            }
        );

        return response.data;
    } catch (error: any) {
        const err = error?.response?.data;

        throw new Error(
            err?.msg ||
            err?.message ||
            err?.error_description ||
            err?.error ||
            "Login failed"
        );
    }
}