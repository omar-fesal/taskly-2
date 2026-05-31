"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import {
    Search,
    SlidersHorizontal,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Pencil,
    Trash2,
    X,
    Check,
    AlertTriangle,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import GetProjectTaskAction from "@/actions/GetProjectTaskAction"
import GetProjectById from "@/actions/GetProjectById"
import EditTaskAction from "@/actions/EditTaskAction"
import DeleteTaskAction from "@/actions/DeleteTaskAction"
import { Input } from "@/components/ui/input"

/* ─── constants ─── */
const PAGE_SIZE = 8

const STATUS_OPTIONS = [
    { value: "TO_DO",       label: "To Do",       bg: "#EFF0F3", text: "#4F5F7B" },
    { value: "IN_PROGRESS", label: "In Progress", bg: "#E8F0FE", text: "#1E40AF" },
    { value: "DONE",        label: "Done",        bg: "#DCFCE7", text: "#15803D" },
    { value: "BLOCKED",     label: "Blocked",     bg: "#FEF2F2", text: "#DC2626" },
]

const STATUS_MAP = Object.fromEntries(STATUS_OPTIONS.map(s => [s.value, s]))

function statusCfg(status?: string) {
    return STATUS_MAP[status ?? ""] ?? { label: status?.replace(/_/g, " ") ?? "—", bg: "#F3F4F6", text: "#6B7280" }
}

/* ─── small helpers ─── */
function formatDate(value?: string) {
    if (!value) return "—"
    const d = new Date(value)
    if (isNaN(d.getTime())) return "—"
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}

function getInitials(name?: string) {
    if (!name) return "?"
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase()).join("")
}

const AVATAR_COLORS = [
    "#003D9B", "#6554C0", "#00875A", "#FF5630",
    "#FF8B00", "#36B37E", "#00B8D9", "#0052CC",
]
function avatarColor(name?: string) {
    if (!name) return "#9CA3AF"
    let h = 0
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
    return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

/* ─── Edit Status Dialog ─── */
function EditStatusDialog({
    task,
    onClose,
    onSave,
    isSaving,
}: {
    task: any
    onClose: () => void
    onSave: (status: string) => void
    isSaving: boolean
}) {
    const [selected, setSelected] = useState<string>(task.status ?? "TO_DO")

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

            {/* Panel */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h2 className="font-main font-bold text-[17px] text-[#041B3C]">Edit Status</h2>
                        <p className="font-main text-[12px] text-[#4F5F7B] mt-0.5 line-clamp-1">{task.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-[#F2F5FF] text-[#737685] transition-colors shrink-0"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Status options */}
                <div className="flex flex-col gap-2">
                    {STATUS_OPTIONS.map(opt => {
                        const active = selected === opt.value
                        return (
                            <button
                                key={opt.value}
                                id={`status-opt-${opt.value.toLowerCase()}`}
                                onClick={() => setSelected(opt.value)}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all font-main text-[14px] font-semibold
                                    ${active ? "border-[#003D9B] bg-[#F0F4FF]" : "border-[#E5E8F0] bg-white hover:border-[#A0BCFF]"}`}
                            >
                                <span className="flex items-center gap-3">
                                    <span
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                                        style={{ backgroundColor: opt.bg, color: opt.text }}
                                    >
                                        {opt.label}
                                    </span>
                                </span>
                                {active && <Check className="w-4 h-4 text-[#003D9B]" />}
                            </button>
                        )
                    })}
                </div>

                {/* Footer */}
                <div className="flex gap-2 mt-1">
                    <button
                        onClick={onClose}
                        className="flex-1 h-10 rounded-lg border border-[#E5E8F0] font-main font-semibold text-[13px] text-[#4F5F7B] hover:bg-[#F7F8FC] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        id="save-status-btn"
                        onClick={() => onSave(selected)}
                        disabled={isSaving || selected === task.status}
                        className="flex-1 h-10 rounded-lg bg-[#003D9B] font-main font-semibold text-[13px] text-white hover:bg-[#0052CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? "Saving…" : "Save"}
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ─── Delete Confirm Dialog ─── */
function DeleteConfirmDialog({
    task,
    onClose,
    onConfirm,
    isDeleting,
}: {
    task: any
    onClose: () => void
    onConfirm: () => void
    isDeleting: boolean
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5">
                <div className="flex flex-col items-center text-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                    </span>
                    <div>
                        <h2 className="font-main font-bold text-[17px] text-[#041B3C]">Delete Task</h2>
                        <p className="font-main text-[13px] text-[#4F5F7B] mt-1">
                            Are you sure you want to delete <span className="font-semibold text-[#041B3C]">"{task.title}"</span>? This action cannot be undone.
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 h-10 rounded-lg border border-[#E5E8F0] font-main font-semibold text-[13px] text-[#4F5F7B] hover:bg-[#F7F8FC] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        id="confirm-delete-btn"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 h-10 rounded-lg bg-red-500 font-main font-semibold text-[13px] text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDeleting ? "Deleting…" : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ─── main page ─── */
export default function ProjectTasksPage() {
    const params = useParams()
    const projectid = params?.projectid as string
    const queryClient = useQueryClient()

    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("ALL")
    const [page, setPage] = useState(1)

    // Dialogs state
    const [editTask, setEditTask] = useState<any | null>(null)
    const [deleteTask, setDeleteTask] = useState<any | null>(null)

    /* ── queries ── */
    const { data: project } = useQuery({
        queryKey: ["project", projectid],
        queryFn: () => GetProjectById(projectid),
        enabled: !!projectid,
    })

    const { data: tasks = [], isLoading } = useQuery({
        queryKey: ["project_tasks", projectid],
        queryFn: () => GetProjectTaskAction(projectid),
        enabled: !!projectid,
    })

    /* ── mutations ── */
    const editMutation = useMutation({
        mutationFn: EditTaskAction,
        onSuccess: () => {
            toast.success("Status updated")
            queryClient.invalidateQueries({ queryKey: ["project_tasks", projectid] })
            setEditTask(null)
        },
        onError: () => toast.error("Failed to update status"),
    })

    const deleteMutation = useMutation({
        mutationFn: DeleteTaskAction,
        onSuccess: () => {
            toast.success("Task deleted")
            queryClient.invalidateQueries({ queryKey: ["project_tasks", projectid] })
            setDeleteTask(null)
        },
        onError: () => toast.error("Failed to delete task"),
    })

    /* ── filter + pagination ── */
    const statuses = useMemo(() => {
        const set = new Set<string>(tasks.map((t: any) => t.status).filter(Boolean))
        return ["ALL", ...Array.from(set)]
    }, [tasks])

    const filtered = useMemo(() => {
        return tasks.filter((t: any) => {
            const matchSearch =
                !search ||
                t.title?.toLowerCase().includes(search.toLowerCase()) ||
                t.task_id?.toLowerCase().includes(search.toLowerCase())
            const matchStatus = statusFilter === "ALL" || t.status === statusFilter
            return matchSearch && matchStatus
        })
    }, [tasks, search, statusFilter])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    const handleSearch = (v: string) => { setSearch(v); setPage(1) }
    const handleStatus = (v: string) => { setStatusFilter(v); setPage(1) }

    /* ── render ── */
    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">

            {/* ── Breadcrumb ── */}
            <div className="px-4 pt-4 sm:px-6 sm:pt-5 flex items-center gap-1">
                <Link href="/projects" className="font-main font-bold text-[12px] text-[#43465499] hover:text-[#003D9B]">
                    PROJECTS
                </Link>
                <span className="font-main font-bold text-[12px] text-[#43465499]"> {">"} </span>
                <Link href={`/projects/${projectid}`} className="font-main font-bold text-[12px] text-[#43465499] hover:text-[#003D9B]">
                    {project?.name ?? "PROJECT"}
                </Link>
                <span className="font-main font-bold text-[12px] text-[#43465499]"> {">"} </span>
                <span className="font-main font-bold text-[12px] text-[#003D9B]">TASKS</span>
            </div>

            {/* ── Header ── */}
            <div className="px-4 sm:px-6 py-4">
                <h1 className="font-main font-bold text-[28px] sm:text-[32px] text-[#041B3C]">Active Workboard</h1>
                <p className="font-main text-[13px] text-[#4F5F7B] mt-0.5">
                    Curating {project?.name ?? "this project"}&apos;s production pipeline and milestones.
                </p>
            </div>

            {/* ── Toolbar ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 pb-4">
                <div className="relative w-full sm:w-[260px]">
                    <Search className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-[#737685]" />
                    <Input
                        id="task-search"
                        type="search"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={e => handleSearch(e.target.value)}
                        className="pl-9 h-10 bg-[#D7E2FF] focus:bg-[#D7E2FF] rounded-md w-full"
                    />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {statuses.map(s => {
                            const active = statusFilter === s
                            return (
                                <button
                                    key={s}
                                    id={`filter-${s.toLowerCase()}`}
                                    onClick={() => handleStatus(s)}
                                    className={`px-3 py-1 rounded-full text-[12px] font-semibold font-main transition-all border
                                        ${active
                                            ? "bg-[#003D9B] text-white border-[#003D9B]"
                                            : "bg-white text-[#4F5F7B] border-[#E5E8F0] hover:border-[#003D9B] hover:text-[#003D9B]"
                                        }`}
                                >
                                    {s === "ALL" ? "All" : statusCfg(s).label}
                                </button>
                            )
                        })}
                    </div>
                    <button
                        id="task-filter-btn"
                        className="flex items-center justify-center w-9 h-9 rounded-md border border-[#E5E8F0] bg-white hover:bg-[#F2F5FF] text-[#737685]"
                        aria-label="More filters"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* ── Table ── */}
            <div className="flex-1 px-4 sm:px-6">
                <div className="rounded-xl border border-[#E5E8F0] bg-white overflow-hidden">

                    {/* Head */}
                    <div className="grid grid-cols-[80px_1fr_130px_120px_160px_48px] items-center px-4 py-3 border-b border-[#E5E8F0] bg-[#F7F8FC]">
                        <span className="font-main font-bold text-[10px] tracking-widest text-[#43465499] uppercase">Task ID</span>
                        <span className="font-main font-bold text-[10px] tracking-widest text-[#43465499] uppercase">Title</span>
                        <span className="font-main font-bold text-[10px] tracking-widest text-[#43465499] uppercase">Status</span>
                        <span className="font-main font-bold text-[10px] tracking-widest text-[#43465499] uppercase">Due Date</span>
                        <span className="font-main font-bold text-[10px] tracking-widest text-[#43465499] uppercase">Assignee</span>
                        <span />
                    </div>

                    {/* Rows */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="w-6 h-6 rounded-full border-2 border-[#003D9B] border-t-transparent animate-spin" />
                        </div>
                    ) : pageData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-2">
                            <p className="font-main text-[14px] text-[#4F5F7B]">No tasks found</p>
                        </div>
                    ) : (
                        pageData.map((task: any) => {
                            const cfg = statusCfg(task.status)
                            const assigneeName = task.assignee?.name ?? task.assignee_name
                            return (
                                <div
                                    key={task.id}
                                    className="grid grid-cols-[80px_1fr_130px_120px_160px_48px] items-center px-4 py-3 border-b border-[#E5E8F0] hover:bg-[#F7F8FC] transition-colors"
                                >
                                    {/* Task ID */}
                                    <span className="font-main font-semibold text-[12px] text-[#003D9B]">
                                        {task.task_id ?? task.id?.slice(0, 8).toUpperCase()}
                                    </span>

                                    {/* Title */}
                                    <span className="font-main text-[14px] text-[#041B3C] truncate pr-4">
                                        {task.title}
                                    </span>

                                    {/* Status */}
                                    <span
                                        className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold font-main w-fit"
                                        style={{ backgroundColor: cfg.bg, color: cfg.text }}
                                    >
                                        {cfg.label}
                                    </span>

                                    {/* Due Date */}
                                    <span className="font-main text-[13px] text-[#4F5F7B]">
                                        {formatDate(task.due_date)}
                                    </span>

                                    {/* Assignee */}
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span
                                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                                            style={{ backgroundColor: avatarColor(assigneeName) }}
                                        >
                                            {getInitials(assigneeName)}
                                        </span>
                                        <span className="font-main text-[13px] text-[#041B3C] truncate">
                                            {assigneeName ?? "Unassigned"}
                                        </span>
                                    </div>

                                    {/* Actions — three-dot dropdown */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button
                                                id={`actions-task-${task.id}`}
                                                className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-[#E5E8F0] text-[#737685] transition-colors"
                                                aria-label="Task actions"
                                            >
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end" className="w-40">
                                            <DropdownMenuItem
                                                id={`edit-task-${task.id}`}
                                                onClick={() => setEditTask(task)}
                                                className="flex items-center gap-2 cursor-pointer text-[#041B3C] font-main text-[13px]"
                                            >
                                                <Pencil className="w-3.5 h-3.5 text-[#003D9B]" />
                                                Edit Status
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                id={`delete-task-${task.id}`}
                                                onClick={() => setDeleteTask(task)}
                                                className="flex items-center gap-2 cursor-pointer text-red-500 font-main text-[13px] focus:text-red-500 focus:bg-red-50"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>

            {/* ── Pagination ── */}
            {filtered.length > 0 && (
                <div className="mt-4 px-4 sm:px-6 pb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="font-main text-[13px] text-[#4F5F7B]">
                        Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} tasks
                    </p>

                    {totalPages > 1 && (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E5E8F0] bg-white text-[#4F5F7B] hover:bg-[#F2F5FF] disabled:opacity-40 disabled:cursor-not-allowed"
                                aria-label="Previous page"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    aria-current={p === page ? "page" : undefined}
                                    className={`flex h-8 w-8 items-center justify-center rounded-md text-[13px] font-semibold border ${
                                        p === page
                                            ? "bg-[#003D9B] text-white border-[#003D9B]"
                                            : "bg-white text-[#4F5F7B] border-[#E5E8F0] hover:bg-[#F2F5FF]"
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}

                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E5E8F0] bg-white text-[#4F5F7B] hover:bg-[#F2F5FF] disabled:opacity-40 disabled:cursor-not-allowed"
                                aria-label="Next page"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ── Edit Status Dialog ── */}
            {editTask && (
                <EditStatusDialog
                    task={editTask}
                    onClose={() => setEditTask(null)}
                    isSaving={editMutation.isPending}
                    onSave={(status) => editMutation.mutate({ id: editTask.id, status })}
                />
            )}

            {/* ── Delete Confirm Dialog ── */}
            {deleteTask && (
                <DeleteConfirmDialog
                    task={deleteTask}
                    onClose={() => setDeleteTask(null)}
                    isDeleting={deleteMutation.isPending}
                    onConfirm={() => deleteMutation.mutate(deleteTask.id)}
                />
            )}
        </div>
    )
}
