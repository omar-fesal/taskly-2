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
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import { useMutation } from "@tanstack/react-query"
import { CreateProjectAction } from "@/actions/CreateProjectAction"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import CreateEpicsAction from "@/actions/CreateEpicsAction"

const formSchema = z.object({
    title: z
        .string()
        .min(5, "Title must be at least 5 characters.")
        .max(100, "Title is too long"),

    description: z
        .string()
        .min(10, "Description must be at least 10 characters."),

    assignee_id: z.string(),

    project_id: z.string().uuid("Invalid project id"),

    deadline: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
            message: "Invalid date",
        }),
});

export default function CreateEpicsForm({ projectid, members }: any) {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            assignee_id: "",
            project_id: projectid,
            deadline: "",
        },
    });
    const CreateProjectMutate = useMutation({
        mutationFn: CreateEpicsAction,
        onSuccess: () => {
            toast.success("crate post successfuly");
            router.refresh()

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
            <CardContent>
                <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="title"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="gap-2" data-invalid={fieldState.invalid}>
                                    <div className="grid grid-cols-3 ">


                                        <FieldLabel
                                            htmlFor="epic-title"
                                            className="font-main text-[11px] font-bold text-[#4F5F7B] col-span-1"
                                        >
                                            Name
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="epic-title"
                                            type="text"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Project title"
                                            autoComplete="text"
                                            className="bg-[#D7E2FF] w-full col-span-2"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </div>
                                </Field>
                            )}
                        />
                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <div className="grid grid-cols-3">


                                        <FieldLabel htmlFor="epic-description"
                                            className=" font-main text-[11px] font-bold  text-[#4F5F7B] col-span-1">
                                            Description
                                        </FieldLabel>
                                        <InputGroup className="col-span-2 w-full bg-[#D7E2FF]  has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border-transparent">
                                            <InputGroupTextarea
                                                {...field}
                                                id="epic-description"
                                                placeholder="I'm having an issue with the login button on mobile."
                                                rows={12}
                                                className="min-h-30 resize-none bg-transparent focus-visible:ring-0"
                                                aria-invalid={fieldState.invalid}
                                            />
                                            <InputGroupAddon align="block-end" className="bg-white border-0 mt-1 justify-end rounded-b-[8px]">
                                                <InputGroupText className="tabular-nums ">
                                                    {field.value.length}/500 characters
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>

                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}

                                    </div>
                                </Field>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4 w-full">


                            <Controller
                                name="assignee_id"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field className="w-full gap-2" data-invalid={fieldState.invalid}>

                                        <FieldLabel className="font-main text-[11px] font-bold text-[#4F5F7B]">
                                            Assignee
                                        </FieldLabel>

                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="w-full bg-[#D7E2FF] py-6 border-none text-[16px] text-[#737685]">
                                                <SelectValue placeholder="Select assignee" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Users</SelectLabel>

                                                    {members.map((member: any) => (
                                                        <SelectItem
                                                            key={member.member_id}
                                                            value={member.user_id}
                                                        >
                                                            {member.metadata?.name || member.email}
                                                        </SelectItem>
                                                    ))}

                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>

                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}

                                    </Field>
                                )}
                            />

                            <Controller
                                name="deadline"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field className="w-full gap-2 " data-invalid={fieldState.invalid}>

                                        <FieldLabel className="font-main text-[11px] font-bold text-[#4F5F7B]">
                                            Deadline
                                        </FieldLabel>

                                        <Input
                                            {...field}
                                            type="date"
                                            className="w-full bg-[#D7E2FF]"
                                            aria-invalid={fieldState.invalid}
                                        />

                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}

                                    </Field>
                                )}
                            />
                        </div>
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <Field orientation="horizontal" className="flex items-end">
                    <Button
                        onClick={() => router.push('/projectepics')}
                        className="w-auto px-10 h-12 rounded-sm bg-white font-main font-bold text-[#4F5F7B] hover:bg-white"
                    >
                        cancel</Button>

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
