import { NextResponse } from "next/server";
import * as z from "zod";

const nameSchema = z.string().min(3).max(50);
const emailSchema = z.string().email();
const departmentSchema = z.string().optional();
const passwordSchema = z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/\d/)
    .regex(/[^A-Za-z0-9]/);

const formRegisterSchema = z
    .object({
        name: nameSchema,
        email: emailSchema,
        jobTitle: departmentSchema,
        password: passwordSchema,
    })
    .transform(({ email, password, name, jobTitle }) => ({
        email,
        password,
        name,
        department: jobTitle,
    }));

const apiRegisterSchema = z
    .object({
        email: emailSchema,
        password: passwordSchema,
        data: z.object({
            name: nameSchema,
            department: departmentSchema,
        }),
    })
    .transform(({ email, password, data }) => ({
        email,
        password,
        name: data.name,
        department: data.department,
    }));

const registerSchema = z.union([formRegisterSchema, apiRegisterSchema]);

function getBackendUrl() {
    return (
        process.env.BACK_END_URL ||
        process.env.NEXT_PUBLIC_BACK_END_URL ||
        process.env.NEXT_PUBLIC_BACK_END_UR
    );
}

function getSupabaseAnonKey() {
    return process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

function getErrorMessage(errorBody: unknown) {
    if (errorBody && typeof errorBody === "object") {
        const body = errorBody as Record<string, unknown>;
        const message =
            body.error_description ||
            body.message ||
            body.msg ||
            body.error;

        if (typeof message === "string") {
            return message;
        }
    }

    return "Registration failed";
}

export async function POST(request: Request) {
    const body = await request.json().catch(() => null);
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            {
                message: "Invalid registration data",
                errors: parsed.error.flatten().fieldErrors,
            },
            { status: 400 }
        );
    }

    const backendUrl = getBackendUrl();
    const anonKey = getSupabaseAnonKey();

    if (!backendUrl || !anonKey) {
        return NextResponse.json(
            { message: "Registration API is not configured" },
            { status: 500 }
        );
    }

    const { email, password, name, department } = parsed.data;
    const response = await fetch(`${backendUrl.replace(/\/$/, "")}/auth/v1/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
        },
        body: JSON.stringify({
            email,
            password,
            data: {
                name,
                department: department || undefined,
            },
        }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        return NextResponse.json(
            {
                message: getErrorMessage(data),
                error: data,
            },
            { status: response.status }
        );
    }

    return NextResponse.json(data);
}
