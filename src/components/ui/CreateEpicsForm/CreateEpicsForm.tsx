"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import * as z from "zod"
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button"
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
import { useMutation } from "@tanstack/react-query"
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
        .min(5, "Title is required (minimum 5 characters)"),

    description: z
        .string(),


    assignee_id: z.string().min(1, "Please select an assignee"),

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

    const createEpicMutation = useMutation({
        mutationFn: CreateEpicsAction,
        onSuccess: () => {
            toast.success("Epic created successfully");
            router.push(`/projects/${projectid}`);
            router.refresh();
        },
        onError: (error: any) => {
            toast.error(error?.message || "Something went wrong");
        }
    });

    function onSubmit(data: z.infer<typeof formSchema>) {
        createEpicMutation.mutate(data);
    }

    return (
        <div>
            {/* Breadcrumb */}
            <div className="mb-2">
                <span className="font-main font-bold text-[12px] text-[#43465499]">
                    PROJECTS
                </span>
                <span className="font-main font-bold text-[12px] text-[#43465499]">
                    {' > '}
                </span>
                <span className="font-main font-bold text-[12px] text-[#43465499]">
                    PROJECT ALPHA
                </span>
                <span className="font-main font-bold text-[12px] text-[#43465499]">
                    {' > '}
                </span>
                <span className="font-main font-bold text-[12px] text-[#43465499]">
                    EPICS
                </span>
                <span className="font-main font-bold text-[12px] text-[#43465499]">
                    {' > '}
                </span>
                <span className="font-main font-bold text-[12px] text-[#041B3C]">
                    NEW EPIC
                </span>
            </div>

            {/* Page Title */}
            <h1 className="font-main font-bold text-[26px] sm:text-[32px] text-[#041B3C] mb-1">
                Create New Epic
            </h1>
            <p className="font-main text-[14px] sm:text-[15px] text-[#4F5F7B] mb-6 max-w-lg">
                Define a major project phase or high-level milestone to group
                related tasks and track architectural progress.
            </p>

            {/* Form Card */}
            <div className="bg-[#F8FAFF] border border-[#E5E8F0] rounded-xl p-4 sm:p-8">
                <form id="create-epic-form" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="gap-6">
                        {/* Title */}
                        <Controller
                            name="title"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] items-start gap-2 sm:gap-4">
                                        <FieldLabel
                                            htmlFor="epic-title"
                                            className="font-main text-[11px] font-bold text-[#4F5F7B] uppercase tracking-wide pt-2"
                                        >
                                            Title <span className="text-red-500">*</span>
                                        </FieldLabel>
                                        <div className="w-full">
                                            <Input
                                                {...field}
                                                id="epic-title"
                                                type="text"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="e.g. Structural Foundation Phase"
                                                autoComplete="off"
                                                className="bg-[#D7E2FF] w-full h-11"
                                            />
                                            {fieldState.invalid && (
                                                <p className="flex items-center gap-1 mt-2 font-main text-[11px] font-bold text-red-600 uppercase tracking-wide">
                                                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-red-500 text-[9px]">!</span>
                                                    {fieldState.error?.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Field>
                            )}
                        />

                        {/* Description */}
                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] items-start gap-2 sm:gap-4">
                                        <div className="pt-2">
                                            <FieldLabel
                                                htmlFor="epic-description"
                                                className="font-main text-[11px] font-bold text-[#4F5F7B] uppercase tracking-wide"
                                            >
                                                Description
                                            </FieldLabel>
                                            <p className="font-main text-[11px] text-[#737685] italic">
                                                Optional
                                            </p>
                                        </div>
                                        <div className="w-full">
                                            <InputGroup className="w-full bg-[#D7E2FF] rounded-lg overflow-hidden has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border-transparent">
                                                <InputGroupTextarea
                                                    {...field}
                                                    id="epic-description"
                                                    placeholder="Describe the scope and objectives of this epic..."
                                                    rows={5}
                                                    className="min-h-[120px] resize-none bg-transparent focus-visible:ring-0"
                                                    aria-invalid={fieldState.invalid}
                                                />
                                                <InputGroupAddon align="block-end" className="bg-white border-0 mt-1 justify-end rounded-b-lg">
                                                    <InputGroupText className="tabular-nums text-[12px] text-[#737685]">
                                                        {field.value?.length || 0} / 500 characters
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </div>
                                    </div>
                                </Field>
                            )}
                        />

                        {/* Assignee + Deadline row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <Controller
                                name="assignee_id"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field className="w-full gap-2" data-invalid={fieldState.invalid}>
                                        <FieldLabel className="font-main text-[11px] font-bold text-[#4F5F7B] uppercase tracking-wide">
                                            Assignee
                                        </FieldLabel>

                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="w-full bg-[#D7E2FF] h-11 border-none text-[14px] text-[#737685]">
                                                <SelectValue placeholder="Select a member..." />
                                            </SelectTrigger>

                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Members</SelectLabel>
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
                                    <Field className="w-full gap-2" data-invalid={fieldState.invalid}>
                                        <FieldLabel className="font-main text-[11px] font-bold text-[#4F5F7B] uppercase tracking-wide">
                                            Deadline
                                        </FieldLabel>

                                        <Input
                                            {...field}
                                            type="date"
                                            className="w-full bg-[#D7E2FF] h-11"
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
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end items-center gap-3 mt-6 pt-4 border-t border-[#E5E8F0]">
                <Button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 h-11 rounded-md bg-transparent font-main font-semibold text-[#4F5F7B] hover:bg-gray-100 shadow-none"
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    form="create-epic-form"
                    disabled={createEpicMutation.isPending}
                    className="px-6 h-11 rounded-md bg-[#003D9B] font-main font-semibold hover:bg-[#0052CC]"
                >
                    {createEpicMutation.isPending ? "Creating..." : "Create Epic"}
                </Button>
            </div>
        </div>
    )
}
