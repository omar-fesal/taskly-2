"use client"

import * as React from "react"
import Link from "next/link"
import { Calendar, ListTodo, Plus, Layers, CheckCircle2 } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export interface EpicTask {
    id: string
    title: string
    status?: string
    assignee?: { name?: string }
    due_date?: string
}

export interface EpicUser {
    id?: string
    name: string
}

export interface EpicData {
    id: string
    epic_id?: string
    title: string
    description?: string
    deadline?: string
    created_at?: string
    created_by?: EpicUser
    assignee?: EpicUser
    tasks?: EpicTask[]
}

export interface EpicDetailsDialogProps {
    epic: EpicData | null
    projectId: string
    open: boolean
    onOpenChange: (open: boolean) => void
    onAddTask?: () => void
}

function formatDate(value?: string) {
    if (!value) return "—"
    const d = new Date(value)
    if (isNaN(d.getTime())) return "—"
    return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })
}

function getInitials(name?: string) {
    if (!name) return "?"
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
}

/** Deterministic colour per assignee name */
const AVATAR_COLORS = [
    "#003D9B", "#0052CC", "#6554C0", "#00875A",
    "#FF5630", "#FF8B00", "#36B37E", "#00B8D9",
]
function avatarColor(name?: string) {
    if (!name) return "#9CA3AF"
    let hash = 0
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export default function EpicDetailsDialog({
    epic,
    projectId,
    open,
    onOpenChange,
    onAddTask,
}: EpicDetailsDialogProps) {
    if (!epic) return null

    const tasks = epic.tasks ?? []
    const addTaskHref = `/createtask?projectId=${projectId}&epicId=${epic.id}`

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl bg-white p-6 sm:p-8 rounded-2xl">
                {/* Epic ID badge */}
                <div className="flex items-center gap-2 mb-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-md bg-[#003D9B]">
                        <Layers className="w-3.5 h-3.5 text-white" />
                    </span>
                    <span className="font-main font-bold text-[11px] tracking-wider text-[#43465499]">
                        {epic.epic_id ?? "EPIC"}
                    </span>
                </div>

                {/* Title */}
                <DialogTitle className="font-main font-bold text-[22px] sm:text-[24px] text-[#041B3C] leading-tight pb-3 border-b border-[#E5E8F0]">
                    {epic.title}
                </DialogTitle>

                {/* Description */}
                {epic.description && (
                    <p className="font-main text-[14px] text-[#4F5F7B] leading-relaxed mt-3">
                        {epic.description}
                    </p>
                )}

                {/* Meta row: Created by, Assignee, Created At */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <MetaCol label="CREATED BY">
                        <UserChip name={epic.created_by?.name} color="#003D9B" />
                    </MetaCol>

                    <MetaCol label="ASSIGNEE">
                        <UserChip name={epic.assignee?.name} color="#A0BCFF" muted />
                    </MetaCol>

                    <MetaCol label="CREATED AT">
                        <div className="flex items-center gap-2 font-main text-[14px] text-[#041B3C]">
                            <Calendar className="w-4 h-4 text-[#737685]" />
                            {formatDate(epic.created_at)}
                        </div>
                    </MetaCol>
                </div>

                {/* Tasks header */}
                <div className="flex items-center justify-between mt-6">
                    <h3 className="font-main font-bold text-[16px] text-[#041B3C]">
                        Tasks
                    </h3>

                    {onAddTask ? (
                        <button
                            onClick={onAddTask}
                            className="flex items-center gap-1 font-main font-semibold text-[13px] text-[#003D9B] hover:text-[#0052CC] cursor-pointer bg-transparent border-none"
                        >
                            <Plus className="w-4 h-4" />
                            Add Task
                        </button>
                    ) : (
                        <Link
                            href={addTaskHref}
                            onClick={() => onOpenChange(false)}
                            className="flex items-center gap-1 font-main font-semibold text-[13px] text-[#003D9B] hover:text-[#0052CC]"
                        >
                            <Plus className="w-4 h-4" />
                            Add Task
                        </Link>
                    )}
                </div>

                {/* Tasks list / empty state */}
                {tasks.length === 0 ? (
                    <div className="mt-3 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#C7CEDB] bg-[#F2F5FF] py-8 px-4 text-center">
                        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white">
                            <ListTodo className="w-5 h-5 text-[#737685]" />
                        </span>
                        <p className="font-main text-[14px] text-[#4F5F7B]">
                            No tasks have been added to this epic yet
                        </p>
                        {onAddTask ? (
                            <Button
                                onClick={onAddTask}
                                className="px-5 h-10 rounded-md bg-[#003D9B] font-main font-semibold hover:bg-[#0052CC]"
                            >
                                <Plus className="w-4 h-4 mr-1.5" />
                                Add Task
                            </Button>
                        ) : (
                            <Button
                                asChild
                                className="px-5 h-10 rounded-md bg-[#003D9B] font-main font-semibold hover:bg-[#0052CC]"
                            >
                                <Link
                                    href={addTaskHref}
                                    onClick={() => onOpenChange(false)}
                                >
                                    <Plus className="w-4 h-4 mr-1.5" />
                                    Add Task
                                </Link>
                            </Button>
                        )}
                    </div>
                ) : (
                    <ul className="mt-3 flex flex-col divide-y divide-[#E5E8F0]">
                        {tasks.map((task) => (
                            <li
                                key={task.id}
                                className="flex items-center gap-3 py-3"
                            >
                                {/* Check icon */}
                                <CheckCircle2 className="w-5 h-5 shrink-0 text-[#C7CEDB]" />

                                {/* Left: title + assignee */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-main font-semibold text-[14px] text-[#041B3C] truncate">
                                        {task.title}
                                    </p>
                                    {task.assignee?.name && (
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <span
                                                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                                                style={{ backgroundColor: avatarColor(task.assignee.name) }}
                                            >
                                                {getInitials(task.assignee.name)}
                                            </span>
                                            <span className="font-main text-[12px] text-[#4F5F7B]">
                                                {task.assignee.name}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Right: due date */}
                                {task.due_date && (
                                    <div className="shrink-0 text-right">
                                        <p className="font-main font-bold text-[10px] tracking-wider text-[#43465499] uppercase">
                                            Due Date
                                        </p>
                                        <p className="font-main text-[13px] text-[#041B3C] mt-0.5">
                                            {formatDate(task.due_date)}
                                        </p>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </DialogContent>
        </Dialog>
    )
}

/* ---------- helper subcomponents ---------- */

function MetaCol({
    label,
    children,
}: {
    label: string
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <span className="font-main font-bold text-[10px] tracking-wider text-[#43465499]">
                {label}
            </span>
            {children}
        </div>
    )
}

function UserChip({
    name,
    color,
    muted = false,
}: {
    name?: string
    color: string
    muted?: boolean
}) {
    return (
        <div className="flex items-center gap-2">
            <span
                className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: color }}
            >
                {getInitials(name)}
            </span>
            <span
                className={
                    "font-main text-[14px] " +
                    (muted ? "text-[#4F5F7B]" : "text-[#041B3C]")
                }
            >
                {name ?? "Unassigned"}
            </span>
        </div>
    )
}
