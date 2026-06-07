"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useWatch } from "react-hook-form"
import Link from "next/link"
import * as z from "zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input"
import { PasswordRules } from "@/components/ui/PasswordRules/PasswordRules"
import { RegisterAction } from "@/actions/RegisterAction"

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
import { useRouter } from "next/navigation"



const formSchema = z
    .object({
        name: z
            .string()
            .min(3, "Name must be at least 3 characters")
            .max(50, "Name is too long"),
        email: z.string().email("Invalid email address"),
        jobTitle: z.string().optional(),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must include an uppercase letter")
            .regex(/[a-z]/, "Password must include a lowercase letter")
            .regex(/\d/, "Password must include a number")
            .regex(/[^A-Za-z0-9]/, "Password must include a special character"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    })

type FormValues = z.infer<typeof formSchema>



export function RegisterForm() {
    const [show, setShow] = useState(false)
    const router = useRouter()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            jobTitle: "",
            password: "",
            confirmPassword: "",
        },
    })

    const password = useWatch({ control: form.control, name: "password" }) ?? ""

    const registerMutation = useMutation({
        mutationKey: ['register'],
        mutationFn: RegisterAction,
        onSuccess: () => {
            toast.success("Account created successfully")
            form.reset()
            router.push('/login')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    function onSubmit(data: FormValues) {
        registerMutation.mutate(data)
    }


    return (
        <Card className="w-full max-w-xl gap-0 rounded-2xl bg-white p-12 shadow-sm ring-0">
            <div className="space-y-6">
                <CardHeader className="px-0 py-0">
                    <CardTitle className="text-center text-[30px] font-semibold text-[#041B3C] font-main py-4 px-2">
                        Create your workspace
                    </CardTitle>
                    <CardDescription className="text-center text-[14px] font-main font-normal text-[#4F5F7B]">
                        Join the editorial approach to task management.
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-0">
                    <form
                        id="register-form"
                        className="space-y-4"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FieldGroup className="gap-4">
                            {/* Name */}
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field className="gap-2" data-invalid={fieldState.invalid}>
                                        <FieldLabel
                                            htmlFor="register-name"
                                            className="font-main font-bold text-[11px] text-[#4F5F7B]"
                                        >
                                            NAME
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="register-name"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Enter your full name"
                                            autoComplete="name"
                                        />
                                        <p className="text-[11px] text-[#C3C6D6] font-main">
                                            3-50 characters, letters only.
                                        </p>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            {/* Email */}
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field className="gap-2" data-invalid={fieldState.invalid}>
                                        <FieldLabel
                                            htmlFor="register-email"
                                            className="font-main font-bold text-[11px] text-[#4F5F7B]"
                                        >
                                            EMAIL
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="register-email"
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

                            {/* Job Title */}
                            <Controller
                                name="jobTitle"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field className="gap-2" data-invalid={fieldState.invalid}>
                                        <FieldLabel
                                            htmlFor="register-job-title"
                                            className="font-main font-bold text-[11px] text-[#4F5F7B]"
                                        >
                                            JOB TITLE (OPTIONAL)
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="register-job-title"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="e.g. Project Manager"
                                            autoComplete="organization-title"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            {/* Password + Confirm Password */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Controller
                                    name="password"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field className="gap-2" data-invalid={fieldState.invalid}>
                                            <FieldLabel
                                                htmlFor="register-password"
                                                className="font-main font-bold text-[11px] text-[#4F5F7B]"
                                            >
                                                PASSWORD
                                            </FieldLabel>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    id="register-password"
                                                    type={show ? "text" : "password"}
                                                    aria-invalid={fieldState.invalid}
                                                    placeholder="Password"
                                                    autoComplete="new-password"
                                                    className="h-12 bg-[#DCE6FF] pr-11 text-[#6B7280] placeholder:text-[#7B8190]"
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

                                <Controller
                                    name="confirmPassword"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field className="gap-2" data-invalid={fieldState.invalid}>
                                            <FieldLabel
                                                htmlFor="register-confirm-password"
                                                className="font-main font-bold text-[11px] text-[#4F5F7B]"
                                            >
                                                CONFIRM PASSWORD
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="register-confirm-password"
                                                type="password"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Repeat your password"
                                                autoComplete="new-password"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                            </div>

                            <PasswordRules password={password} />

                            {/* Submit */}
                            <Button
                                disabled={registerMutation.isPending}
                                type="submit"
                                className="w-full h-12 rounded-sm bg-[#003D9B] font-main font-semibold hover:bg-[#003D9B]/90"
                            >
                                {registerMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>

                <p className="text-center text-sm font-main text-[#4F5F7B]">
                    Already have an account?{" "}
                    <Link className="font-semibold text-[#0B5ED7]" href="/login">
                        Log in
                    </Link>
                </p>
            </div>
        </Card>
    )
}
