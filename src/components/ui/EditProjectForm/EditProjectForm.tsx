"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import * as z from "zod"
import { useRouter } from "next/navigation"

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
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import EditProjectAction from "@/actions/EditProjectAction"
import GetProjectById from "@/actions/GetProjectById"
import { Loader2 } from "lucide-react"


const formSchema = z.object({
    name: z
        .string()
        .min(5, "Project name must be at least 5 characters.")
        .max(32, "Project name must be at most 32 characters."),
    description: z
        .string()
})

interface EditProjectFormProps {
    projectId: string;
}

export function EditProjectForm({ projectId }: EditProjectFormProps) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: project, isLoading } = useQuery({
        queryKey: ["project", projectId],
        queryFn: () => GetProjectById(projectId),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        values: {
            name: project?.name || "",
            description: project?.description || "",
        },
    })

    const EditProjectMutate = useMutation({
        mutationFn: EditProjectAction,
        onSuccess: () => {
            toast.success("Project updated successfully");
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["project", projectId] });
            form.reset({
                name: "",
                description: "",
            });
            router.push("/projects")
        },
        onError: (error: any) => {
            toast.error(error?.message || "Something went wrong");
        }
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
        EditProjectMutate.mutate({
            id: projectId,
            name: data.name,
            description: data.description,
        })
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-slate-500" />
            </div>
        )
    }

    return (
        <Card className="w-2xl">
            <CardHeader className="border-b">
                <CardTitle className="font-main font-semibold text-2xl">Edit Project</CardTitle>
                <CardDescription className="font-main text-[14px] text-[#4F5F7B]">
                    Update the details of your project.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="edit-project-form" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="gap-2" data-invalid={fieldState.invalid}>
                                    <FieldLabel
                                        htmlFor="project-name"
                                        className="font-main text-[11px] font-bold text-[#4F5F7B]"
                                    >
                                        Name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="project-name"
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
                                    <FieldLabel
                                        htmlFor="project-description"
                                        className="font-main text-[11px] font-bold text-[#4F5F7B]"
                                    >
                                        Description
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupTextarea
                                            {...field}
                                            id="project-description"
                                            placeholder="Project description"
                                            rows={12}
                                            className="min-h-30 resize-none bg-[#D7E2FF] text-[#737685]"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        <InputGroupAddon align="block-end" className="bg-white border-0 mt-1">
                                            <InputGroupText className="tabular-nums">
                                                {field.value.length}/500 characters
                                            </InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
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
                        Back
                    </Button>

                    <Button
                        type="submit"
                        form="edit-project-form"
                        disabled={EditProjectMutate.isPending}
                        className="w-auto px-10 h-12 rounded-sm bg-[#003D9B] font-main font-semibold hover:bg-[#0052CC]"
                    >
                        {EditProjectMutate.isPending ? "Updating..." : "Update"}
                    </Button>
                </Field>
            </CardFooter>
        </Card>
    )
}
