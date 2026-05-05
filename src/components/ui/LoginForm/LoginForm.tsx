"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import Link from "next/link"
import * as z from "zod"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { LoginAction } from "@/actions/LoginAction";


import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
})

type FormValues = z.infer<typeof formSchema>

export function LoginForm() {
    const [show, setShow] = useState(false)
    const router = useRouter();



    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })


    const loginMutation = useMutation({

        mutationFn: LoginAction,
        onSuccess: (data) => {
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);
            toast.success("Logged in successfully");
            router.push("/projects");
        },

        onError: (error) => {
            console.log(error);
            toast.error("Login failed");
        },
    });

    function onSubmit(data: FormValues) {
        loginMutation.mutate(data)
    }

    return (
        <Card className="w-full  max-w-md gap-0 rounded-2xl bg-white p-8 shadow-sm ring-0 sm:p-12">
            <div className="space-y-6">
                <CardHeader className="px-0 py-0">
                    <CardTitle className="px-2 py-4 text-center font-main text-[30px] font-semibold text-[#041B3C]">
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-center font-main text-[14px] font-normal text-[#4F5F7B]">
                        Please enter your details to access your workspace
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-0">
                    <form
                        id="login-form"
                        className="space-y-4"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FieldGroup className="gap-4">
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field className="gap-2" data-invalid={fieldState.invalid}>
                                        <FieldLabel
                                            htmlFor="login-email"
                                            className="font-main text-[11px] font-bold text-[#4F5F7B]"
                                        >
                                            EMAIL
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="login-email"
                                            type="email"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="yourname@company.com"
                                            autoComplete="email"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field className="gap-2" data-invalid={fieldState.invalid}>
                                        <FieldLabel
                                            htmlFor="login-password"
                                            className="font-main text-[11px] font-bold text-[#4F5F7B]"
                                        >
                                            PASSWORD
                                        </FieldLabel>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                id="login-password"
                                                type={show ? "text" : "password"}
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Password"
                                                autoComplete="current-password"
                                                className="pr-11"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShow((prev) => !prev)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7B8190]"
                                                aria-label={show ? "Hide password" : "Show password"}
                                            >
                                                {show ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Button
                                type="submit"
                                className="h-12 w-full rounded-lg bg-[#003D9B] font-main font-semibold hover:bg-[#003D9B]/90"
                            >
                                Log In
                            </Button>

                            <div className="pt-8 text-center text-[11px] text-[#4F5F7B]">
                                have an account?{" "}
                                <Link href="/register" className="font-bold text-[#0B5ED7]">
                                    Sign Up
                                </Link>
                            </div>
                        </FieldGroup>
                    </form>
                </CardContent>
            </div>
        </Card>
    )
}
