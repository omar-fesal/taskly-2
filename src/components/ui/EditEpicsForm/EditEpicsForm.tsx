"use client"

import { useEffect } from "react"

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

import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"

import {
    useMutation,
    useQuery,
    useQueryClient
} from "@tanstack/react-query"

import EditEpicAction from "@/actions/EditEpicAction"
import GetEpicByIdAction from "@/actions/GetEpicByIdAction"

const formSchema = z.object({
    title: z
        .string()
        .min(5, "Project name must be at least 5 characters.")
        .max(32, "Project name must be at most 32 characters."),

    description: z.string()
})

interface EditProjectFormProps {
    epicId: string;
}

export default function EditEpicsForm({
    epicId
}: EditProjectFormProps) {

    const router = useRouter()
    const queryClient = useQueryClient()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

        defaultValues: {
            title: "",
            description: ""
        }
    })

    // Get Epic Data
    const { data, isLoading } = useQuery({
        queryKey: ["epic", epicId],
        queryFn: () => GetEpicByIdAction(epicId)
    })

    // Fill Inputs
    useEffect(() => {
        if (data) {
            form.reset({
                title: data.title,
                description: data.description
            })
        }
    }, [data, form])

    // Update Mutation
    const EditEpicsMutate = useMutation({
        mutationFn: EditEpicAction,

        onSuccess: () => {
            toast.success("Epics updated successfully")
            queryClient.invalidateQueries({ queryKey: ["epics", data?.project_id] })
            queryClient.invalidateQueries({ queryKey: ["epic", epicId] })

            router.push(`/projects/${data.project_id}`)
        },

        onError: (error: any) => {
            toast.error(
                error?.message || "Something went wrong"
            )
        }
    })

    function onSubmit(data: z.infer<typeof formSchema>) {

        EditEpicsMutate.mutate({
            id: epicId,
            title: data.title,
            description: data.description
        })
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <Card className="w-2xl">

            <CardHeader className="border-b">

                <CardTitle className="font-main font-semibold text-2xl">
                    Edit Project
                </CardTitle>

                <CardDescription className="font-main text-[14px] text-[#4F5F7B]">
                    Update the details of your project.
                </CardDescription>

            </CardHeader>

            <CardContent>

                <form
                    id="edit-project-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                >

                    <FieldGroup>

                        <Controller
                            name="title"
                            control={form.control}
                            render={({ field, fieldState }) => (

                                <Field
                                    className="gap-2"
                                    data-invalid={fieldState.invalid}
                                >

                                    <FieldLabel
                                        htmlFor="project-name"
                                        className="font-main text-[11px] font-bold text-[#4F5F7B]"
                                    >
                                        Name
                                    </FieldLabel>

                                    <input
                                        {...field}
                                        id="project-name"
                                        type="text"
                                        placeholder="Project title"
                                        className="w-full h-12 px-3 rounded-md bg-[#D7E2FF]"
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
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
                                            className="min-h-30 resize-none bg-[#D7E2FF]"
                                            aria-invalid={fieldState.invalid}
                                        />

                                        <InputGroupAddon
                                            align="block-end"
                                            className="bg-white border-0 mt-1"
                                        >

                                            <InputGroupText className="tabular-nums">
                                                {field.value?.length || 0}/500
                                                characters
                                            </InputGroupText>

                                        </InputGroupAddon>

                                    </InputGroup>

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}

                                </Field>
                            )}
                        />

                    </FieldGroup>

                </form>

            </CardContent>

            <CardFooter>

                <Field
                    orientation="horizontal"
                    className="flex justify-between w-full"
                >

                    <Button
                        type="button"
                        onClick={() => router.push('/projects')}
                        className="w-auto px-10 h-12 rounded-sm bg-white font-main font-bold text-[#4F5F7B] hover:bg-white"
                    >
                        Back
                    </Button>

                    <Button
                        type="submit"
                        form="edit-project-form"
                        disabled={EditEpicsMutate.isPending}
                        className="w-auto px-10 h-12 rounded-sm bg-[#003D9B] font-main font-semibold hover:bg-[#0052CC]"
                    >

                        {EditEpicsMutate.isPending
                            ? "Updating..."
                            : "Update"}

                    </Button>

                </Field>

            </CardFooter>

        </Card>
    )
}