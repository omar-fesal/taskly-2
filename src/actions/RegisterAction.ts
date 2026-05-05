"use client"
import AxiosInstance from "@/lib/AxiosBase";

export type RegisterActionPayload = {
    name: string;
    email: string;
    jobTitle?: string;
    password: string;
};

export async function RegisterAction(data: RegisterActionPayload) {
    try {
        const response = await AxiosInstance.post("/auth/v1/signup", {
            email: data.email,
            password: data.password,
            data: {
                name: data.name,
                department: data.jobTitle || "Frontend",
            },
        });
        return response.data;
    } catch (error: any) {
        const err = error?.response?.data;

        throw new Error(
            err?.error_code ||
            err?.msg ||

            "Registration failed"
        );
    }

}



