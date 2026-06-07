"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import * as z from "zod"
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import CreateProjectAction from "@/actions/CreateProjectAction"


const formSchema = z.object({
    name: z
        .string()
        .min(3, "Bug title must be at least 5 characters.")
        .max(32, "Bug title must be at most 32 characters."),
    description: z
        .string()

})

export function CreateProjectForm() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    })

    const CreateProjectMutate = useMutation({
        mutationFn: CreateProjectAction,
        onSuccess: () => {
            toast.success("Project created successfully!");
            queryClient.invalidateQueries({
                queryKey: ["projects"]
            });
            router.push("/projects")
        },
        onError: (error: any) => {
            toast.error(error?.message || "Something went wrong");
        }
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
        CreateProjectMutate.mutate(data)
    }

    return (
        <Card className="w-2xl ">
            <CardHeader className="border-b">
                <CardTitle className="font-main font-semibold text-2xl">Initialize New Project</CardTitle>
                <CardDescription className="font-main text-[14px] text-[#4F5F7B]">
                    Define the scope and foundational details of your project.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="gap-2" data-invalid={fieldState.invalid}>
                                    <FieldLabel
                                        htmlFor="task-text"
                                        className="font-main text-[11px] font-bold text-[#4F5F7B]"
                                    >
                                        Name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="task-text"
                                        type="text"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Project title"
                                        autoComplete="text"
                                        className="bg-[#D7E2FF]"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-demo-description"
                                        className="font-main text-[11px] font-bold  text-[#4F5F7B]">
                                        Description
                                    </FieldLabel>
                                    <div className="flex flex-col">
                                        <Textarea
                                            {...field}
                                            id="form-rhf-demo-description"
                                            placeholder="Describe the project goals, scope, and any relevant context..."
                                            rows={12}
                                            className="min-h-30 resize-none text-[#737685] bg-[#D7E2FF] border-0 shadow-none focus-visible:ring-0 focus-visible:outline-none rounded-md"
                                            aria-invalid={fieldState.invalid}
                                            autoFocus={false}
                                        />
                                        <span className="mt-1 text-[11px] tabular-nums text-muted-foreground">
                                            {field.value.length}/500 characters
                                        </span>
                                    </div>

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <Field orientation="horizontal" className="flex justify-between">
                    <Button
                        onClick={() => router.push('/projects')}
                        className="w-auto px-10 h-12 rounded-sm bg-white font-main font-bold text-[#4F5F7B] hover:bg-white"
                    >
                        Back</Button>

                    <Button
                        type="submit"
                        form="form-rhf-demo"
                        disabled={CreateProjectMutate.isPending}
                        className="w-auto px-10 h-12 rounded-sm bg-[#003D9B] font-main font-semibold hover:bg-[#0052CC]"
                    >
                        {CreateProjectMutate.isPending ? "Creating..." : "Submit"}
                    </Button>
                </Field>
            </CardFooter>
        </Card>
    )
}
