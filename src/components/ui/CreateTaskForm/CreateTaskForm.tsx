"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import Link from "next/link"

import GetMemberAction from "@/actions/GetMemberAction"
import GetEpicsCardAction from "@/actions/GetEpicsCard"
import CreateTaskAction from "@/actions/CreateTaskAction"

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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export interface MemberOption {
    user_id: string
    member_id?: string
    email?: string
    metadata?: { name?: string }
}

export interface EpicOption {
    id: string
    title: string
    epic_id?: string
}

export interface CreateTaskFormProps {
    projectId?: string
    epicId?: string
    onClose?: () => void
}

const STATUS_OPTIONS = [
    { value: "TO_DO", label: "TO DO" },
    { value: "IN_PROGRESS", label: "IN PROGRESS" },
    { value: "DONE", label: "DONE" },
] as const

const formSchema = z.object({
    title: z
        .string()
        .min(3, "Title is required (minimum 3 characters)"),

    status: z.enum(["TO_DO", "IN_PROGRESS", "DONE"]),

    assignee_id: z.string().min(1, "Please select an assignee"),

    epic_id: z.string().min(1, "Please select an epic"),

    due_date: z
        .string()
        .refine(
            (date) => !!date && !isNaN(Date.parse(date)),
            { message: "Invalid date" }
        ),

    description: z.string().optional(),
})

export type TaskFormValues = z.infer<typeof formSchema>

export default function CreateTaskForm({
    projectId,
    epicId,
    onClose,
}: CreateTaskFormProps) {
    const router = useRouter()
    const queryClient = useQueryClient()

    // Fetch project members for the assignee dropdown
    const { data: members = [], isLoading: isLoadingMembers } = useQuery<MemberOption[]>({
        queryKey: ["members", projectId],
        queryFn: () => GetMemberAction(projectId as string),
        enabled: !!projectId,
    })

    // Fetch project epics for the epic dropdown
    const { data: epics = [], isLoading: isLoadingEpics } = useQuery<EpicOption[]>({
        queryKey: ["epics", projectId],
        queryFn: () => GetEpicsCardAction(projectId as string),
        enabled: !!projectId,
    })

    const form = useForm<TaskFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            status: "TO_DO",
            assignee_id: "",
            epic_id: epicId ?? "",
            due_date: "",
            description: "",
        },
    })

    const createTaskMutation = useMutation({
        mutationFn: CreateTaskAction,
        onSuccess: () => {
            toast.success("Task created successfully")
            queryClient.invalidateQueries({ queryKey: ["tasks", projectId] })
            queryClient.invalidateQueries({ queryKey: ["project_tasks", projectId] })
            if (onClose) {
                onClose()
            } else if (projectId) {
                router.push(`/projects/${projectId}`)
            } else {
                router.back()
            }
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to create task")
        },
    })

    function handleSubmit(data: TaskFormValues) {
        if (!projectId) {
            toast.error("Missing project id")
            return
        }
        createTaskMutation.mutate({
            project_id: projectId,
            epic_id: data.epic_id,
            title: data.title,
            description: data.description ?? "",
            assignee_id: data.assignee_id,
            due_date: data.due_date,
            status: data.status,
        })
    }

    const isSubmitting = createTaskMutation.isPending

    return (
        <div>
            {/* Breadcrumb */}
            <div className="mb-2">
                <Link
                    href="/projects"
                    className="font-main font-bold text-[12px] text-[#43465499] hover:text-[#003D9B]"
                >
                    PROJECTS
                </Link>
                <span className="font-main font-bold text-[12px] text-[#43465499]">
                    {' > '}
                </span>
                {projectId ? (
                    <Link
                        href={`/projects/${projectId}`}
                        className="font-main font-bold text-[12px] text-[#43465499] hover:text-[#003D9B]"
                    >
                        PROJECT
                    </Link>
                ) : (
                    <span className="font-main font-bold text-[12px] text-[#43465499]">
                        PROJECT
                    </span>
                )}
                <span className="font-main font-bold text-[12px] text-[#43465499]">
                    {' > '}
                </span>
                <span className="font-main font-bold text-[12px] text-[#43465499]">
                    TASKS
                </span>
                <span className="font-main font-bold text-[12px] text-[#43465499]">
                    {' > '}
                </span>
                <span className="font-main font-bold text-[12px] text-[#041B3C]">
                    NEW TASK
                </span>
            </div>

            {/* Page Title */}
            <h1 className="font-main font-bold text-[26px] sm:text-[32px] text-[#041B3C] mb-1">
                Create New Task
            </h1>
            <p className="font-main text-[14px] sm:text-[15px] text-[#4F5F7B] mb-6">
                Initialize a new work item within the Architectural Workspace ecosystem.
            </p>

            {/* Form Card */}
            <div className="bg-white border border-[#E5E8F0] rounded-xl p-4 sm:p-8 shadow-sm">
                <form id="create-task-form" onSubmit={form.handleSubmit(handleSubmit)}>
                    <FieldGroup className="gap-5">
                        {/* Title */}
                        <Controller
                            name="title"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="gap-2" data-invalid={fieldState.invalid}>
                                    <FieldLabel
                                        htmlFor="task-title"
                                        className="font-main text-[11px] font-bold text-[#4F5F7B] uppercase tracking-wide"
                                    >
                                        Title <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="task-title"
                                        type="text"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="e.g., Finalize structural schematics"
                                        autoComplete="off"
                                        className="bg-[#D7E2FF] w-full h-11"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        {/* Status + Assignee */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <Controller
                                name="status"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field className="gap-2" data-invalid={fieldState.invalid}>
                                        <FieldLabel className="font-main text-[11px] font-bold text-[#4F5F7B] uppercase tracking-wide">
                                            Status <span className="text-red-500">*</span>
                                        </FieldLabel>

                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-full bg-[#D7E2FF] h-11 border-none text-[14px] text-[#041B3C]">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Status</SelectLabel>
                                                    {STATUS_OPTIONS.map((opt) => (
                                                        <SelectItem key={opt.value} value={opt.value}>
                                                            {opt.label}
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
                                name="assignee_id"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field className="gap-2" data-invalid={fieldState.invalid}>
                                        <FieldLabel className="font-main text-[11px] font-bold text-[#4F5F7B] uppercase tracking-wide">
                                            Assignee
                                        </FieldLabel>

                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || undefined}
                                            disabled={isLoadingMembers || !projectId}
                                        >
                                            <SelectTrigger className="w-full bg-[#D7E2FF] h-11 border-none text-[14px] text-[#737685]">
                                                <SelectValue
                                                    placeholder={
                                                        isLoadingMembers
                                                            ? "Loading members..."
                                                            : "Select Team Member"
                                                    }
                                                />
                                            </SelectTrigger>

                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Team Members</SelectLabel>
                                                    {isLoadingMembers ? (
                                                        <div className="flex items-center gap-2 px-3 py-2 text-[13px] text-[#737685]">
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                            Loading...
                                                        </div>
                                                    ) : members.length === 0 ? (
                                                        <div className="px-3 py-2 text-[13px] text-[#737685]">
                                                            No members available
                                                        </div>
                                                    ) : (
                                                        members.map((member) => (
                                                            <SelectItem
                                                                key={member.member_id ?? member.user_id}
                                                                value={member.user_id}
                                                            >
                                                                {member.metadata?.name || member.email}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>

                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </div>

                        {/* Epic */}
                        <Controller
                            name="epic_id"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="gap-2" data-invalid={fieldState.invalid}>
                                    <FieldLabel className="font-main text-[11px] font-bold text-[#4F5F7B] uppercase tracking-wide">
                                        Epic <span className="text-red-500">*</span>
                                    </FieldLabel>

                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value || undefined}
                                        disabled={isLoadingEpics || !projectId}
                                    >
                                        <SelectTrigger className="w-full bg-[#D7E2FF] h-11 border-none text-[14px] text-[#737685]">
                                            <SelectValue
                                                placeholder={
                                                    isLoadingEpics
                                                        ? "Loading epics..."
                                                        : "Select Epic Link"
                                                }
                                            />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Epics</SelectLabel>
                                                {isLoadingEpics ? (
                                                    <div className="flex items-center gap-2 px-3 py-2 text-[13px] text-[#737685]">
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        Loading...
                                                    </div>
                                                ) : epics.length === 0 ? (
                                                    <div className="px-3 py-2 text-[13px] text-[#737685]">
                                                        No epics available
                                                    </div>
                                                ) : (
                                                    epics.map((epic) => (
                                                        <SelectItem key={epic.id} value={epic.id}>
                                                            {epic.epic_id ? `${epic.epic_id} — ` : ""}
                                                            {epic.title}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        {/* Due Date */}
                        <Controller
                            name="due_date"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="gap-2" data-invalid={fieldState.invalid}>
                                    <FieldLabel
                                        htmlFor="task-due-date"
                                        className="font-main text-[11px] font-bold text-[#4F5F7B] uppercase tracking-wide"
                                    >
                                        Due Date <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="task-due-date"
                                        type="date"
                                        aria-invalid={fieldState.invalid}
                                        className="bg-[#D7E2FF] w-full h-11"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        {/* Description */}
                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="gap-2" data-invalid={fieldState.invalid}>
                                    <FieldLabel
                                        htmlFor="task-description"
                                        className="font-main text-[11px] font-bold text-[#4F5F7B] uppercase tracking-wide"
                                    >
                                        Description
                                    </FieldLabel>
                                    <InputGroup className="w-full bg-[#D7E2FF] rounded-lg overflow-hidden has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border-transparent">
                                        <InputGroupTextarea
                                            {...field}
                                            id="task-description"
                                            placeholder="Provide detailed context for this task..."
                                            rows={5}
                                            className="min-h-[120px] resize-none bg-transparent focus-visible:ring-0"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        <InputGroupAddon align="block-end" className="bg-transparent border-0 mt-1 justify-end rounded-b-lg">
                                            <InputGroupText className="tabular-nums text-[12px] text-[#737685]">
                                                {field.value?.length || 0} / 1000 characters
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

                    <div className="flex justify-end items-center gap-3 mt-6">
                        <Button
                            type="button"
                            onClick={() => {
                                if (onClose) {
                                    onClose()
                                } else {
                                    router.back()
                                }
                            }}
                            className="px-6 h-11 rounded-md bg-transparent font-main font-semibold text-[#4F5F7B] hover:bg-gray-100 shadow-none"
                        >
                            Back
                        </Button>

                        <Button
                            type="submit"
                            form="create-task-form"
                            disabled={isSubmitting}
                            className="px-6 h-11 rounded-md bg-[#003D9B] font-main font-semibold hover:bg-[#0052CC]"
                        >
                            {isSubmitting ? "Creating..." : "Create Task"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
