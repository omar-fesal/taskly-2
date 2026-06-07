"use client"

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Flag,
    GitBranch,
    LayoutGrid,
    MoreHorizontal,
    Plus,
    Search,
    Target,
    UserPen,
} from "lucide-react";

import Link from "next/link";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import CreateEpicsForm from "@/components/ui/CreateEpicsForm/CreateEpicsForm";
import CreateTaskForm from "@/components/ui/CreateTaskForm/CreateTaskForm";
import EpicDetailsDialog, {
    type EpicData,
} from "@/components/ui/EpicDetailsDialog/EpicDetailsDialog";

import {
    useMutation,
    useQuery,
    useQueryClient
} from "@tanstack/react-query";

import toast from "react-hot-toast";
import DeleteEpic from "@/actions/DeleteEpicsAction";
import { useParams } from "next/navigation";
import GetEpicsCardAction from "@/actions/GetEpicsCard";
import GetMemberAction from "@/actions/GetMemberAction";
import GetProjectTaskAction from "@/actions/GetProjectTaskAction";
import GetProjectById from "@/actions/GetProjectById";
import { useMemo, useState } from "react";

const PAGE_SIZE = 6;

interface TaskItem {
    id: string;
    epic_id?: string;
    title: string;
    status?: string;
    assignee?: { name?: string };
    assignee_name?: string;
    due_date?: string;
}

export default function ProjectDetails() {
    const params = useParams();
    const projectid = params?.projectid as string;
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [selectedEpic, setSelectedEpic] = useState<EpicData | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [createEpicOpen, setCreateEpicOpen] = useState(false);
    const [createTaskOpen, setCreateTaskOpen] = useState(false);

    const { data: project } = useQuery({
        queryKey: ["project", projectid],
        queryFn: () => GetProjectById(projectid),
        enabled: !!projectid,
    });

    // Get Epics
    const { data = [] } = useQuery<EpicData[]>({
        queryKey: ["epics", projectid],
        queryFn: () => GetEpicsCardAction(projectid as string)
    });


    const { data: projectTasks = [] } = useQuery<TaskItem[]>({
        queryKey: ["project_tasks", projectid],
        queryFn: () => GetProjectTaskAction(projectid),
        enabled: detailsOpen,
    });

    // Get Members
    const { data: members = [] } = useQuery({
        queryKey: ["members", projectid],
        queryFn: () => GetMemberAction(projectid as string)
    });


    const deleteMutation = useMutation({
        mutationFn: DeleteEpic,
        onSuccess: () => {
            toast.success("Epic deleted successfully");
            queryClient.invalidateQueries({
                queryKey: ["epics", projectid]
            });
        },
        onError: () => {
            toast.error("Failed to delete epic");
        }
    });

    const total = data.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    const pageData = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return data.slice(start, start + PAGE_SIZE);
    }, [data, page]);

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">

            <div className="px-4 pt-4 sm:px-6 sm:pt-5">
                <Link
                    href={'/projects'}
                    className="font-main font-bold text-[12px] text-[#43465499] hover:text-[#003D9B]"
                >
                    PROJECTS
                </Link>
                <span className="font-main font-bold text-[12px] text-[#43465499]">
                    {' > '}
                </span>
                <span className="font-main font-bold text-[12px] text-[#43465499] uppercase">
                    {project?.name ?? "PROJECT NAME"}
                </span>
                <span className="font-main font-bold text-[12px] text-[#43465499]">
                    {' > '}
                </span>
                <span className="font-main font-bold text-[12px] text-[#003D9B]">
                    EPICS
                </span>
            </div>


            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5">
                <h2 className="font-main font-semibold text-[24px] sm:text-[30px] text-[#041B3C]">
                    Project Epics
                </h2>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative">
                        <Input
                            type="search"
                            placeholder="Search epics..."
                            className="pl-9 h-10 sm:h-11 w-full sm:w-50 bg-[#D7E2FF] focus:bg-[#D7E2FF] rounded-md"
                        />
                        <Search className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-[#737685]" />
                    </div>

                    <Button
                        onClick={() => setCreateEpicOpen(true)}
                        className="px-4 h-10 sm:h-11 rounded-md bg-[#003D9B] font-main font-semibold hover:bg-[#0052CC] whitespace-nowrap text-[13px]"
                    >
                        <Plus className="mr-1.5 w-4 h-4" />
                        New Epic
                    </Button>
                </div>
            </div>

            {/* Single Create Epic Dialog — one instance, two triggers */}
            <Dialog open={createEpicOpen} onOpenChange={setCreateEpicOpen}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogTitle className="sr-only">Create New Epic</DialogTitle>
                    <DialogDescription className="sr-only">
                        Define a major project phase or high-level milestone to group related tasks and track architectural progress.
                    </DialogDescription>
                    <CreateEpicsForm
                        projectid={projectid}
                        members={members}
                        onClose={() => setCreateEpicOpen(false)}
                    />
                </DialogContent>
            </Dialog>


            <div className="flex-1 px-4 sm:px-6">
                {data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">

                        <div className="relative mb-8">
                            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[#EEF3FF] to-[#D7E2FF] flex items-center justify-center shadow-md">
                                <div className="grid grid-cols-2 gap-1.5 p-2">
                                    <div className="w-9 h-9 rounded-md bg-white shadow-sm flex items-center justify-center">
                                        <LayoutGrid className="w-4 h-4 text-[#003D9B]" />
                                    </div>
                                    <div className="w-9 h-9 rounded-md bg-white shadow-sm flex items-center justify-center">
                                        <Flag className="w-4 h-4 text-[#003D9B]" />
                                    </div>
                                    <div className="w-9 h-9 rounded-md bg-white shadow-sm flex items-center justify-center">
                                        <GitBranch className="w-4 h-4 text-[#003D9B]" />
                                    </div>
                                    <div className="w-9 h-9 rounded-md bg-[#003D9B] shadow-sm flex items-center justify-center">
                                        <Plus className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>


                        <h3 className="font-main font-bold text-[22px] text-[#041B3C] mb-2">
                            No epics in this project yet.
                        </h3>
                        <p className="font-main text-[13px] text-[#4F5F7B] max-w-xs leading-relaxed mb-7">
                            Break down your large project into manageable epics to track progress better and maintain architectural clarity.
                        </p>


                        <Button
                            onClick={() => setCreateEpicOpen(true)}
                            className="px-6 h-11 rounded-md bg-[#003D9B] font-main font-semibold hover:bg-[#0052CC] text-[13px]"
                        >
                            <Plus className="mr-2 w-4 h-4" />
                            Create First Epic
                        </Button>

                        {/* Feature highlights */}
                        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl">
                            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#F6F8FF] border border-[#E5E8F0]">
                                <div className="w-9 h-9 rounded-md bg-[#D7E2FF] flex items-center justify-center">
                                    <Target className="w-4 h-4 text-[#003D9B]" />
                                </div>
                                <p className="font-main font-semibold text-[12px] text-[#041B3C]">High Level Goals</p>
                                <p className="font-main text-[11px] text-[#4F5F7B] text-center leading-relaxed">
                                    Define overarching aims that set scope and direction for your team.
                                </p>
                            </div>
                            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#F6F8FF] border border-[#E5E8F0]">
                                <div className="w-9 h-9 rounded-md bg-[#D7E2FF] flex items-center justify-center">
                                    <GitBranch className="w-4 h-4 text-[#003D9B]" />
                                </div>
                                <p className="font-main font-semibold text-[12px] text-[#041B3C]">Hierarchy Design</p>
                                <p className="font-main text-[11px] text-[#4F5F7B] text-center leading-relaxed">
                                    Link epics and tasks in a structured hierarchy for proportional clarity.
                                </p>
                            </div>
                            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#F6F8FF] border border-[#E5E8F0]">
                                <div className="w-9 h-9 rounded-md bg-[#D7E2FF] flex items-center justify-center">
                                    <Flag className="w-4 h-4 text-[#003D9B]" />
                                </div>
                                <p className="font-main font-semibold text-[12px] text-[#041B3C]">Track Holistic</p>
                                <p className="font-main text-[11px] text-[#4F5F7B] text-center leading-relaxed">
                                    Monitor progress at every level without losing the broader picture.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pageData.map((epic: EpicData) => (
                            <Card
                                key={epic.id}
                                className="relative w-full border-l-4 border-[#004E32] bg-white rounded-xl shadow-sm"
                            >
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            className="absolute top-3 right-3 z-10 p-1 rounded-md hover:bg-gray-100"
                                            aria-label="Epic actions"
                                        >
                                            <MoreHorizontal className="w-5 h-5 cursor-pointer text-[#73768599]" />
                                        </button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end">
                                        {/* <DropdownMenuItem asChild>
                                        <Link href={`/createtask?projectId=${projectid}&epicId=${epic.id}`}>
                                            Create Task
                                        </Link>
                                    </DropdownMenuItem> */}
                                        <DropdownMenuItem
                                            onClick={() => {
                                                setSelectedEpic(epic as EpicData);
                                                setDetailsOpen(true);
                                            }}
                                        >
                                            Task Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={`/editepics/${epic.id}`}>
                                                Edit
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-red-500 font-main text-[13px] focus:text-red-500 focus:bg-red-50"
                                            onClick={() => deleteMutation.mutate(epic.id)}
                                        >
                                            Delete
                                        </DropdownMenuItem>

                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <CardHeader className="pb-2">
                                    <CardTitle className="py-1 px-2.5 bg-[#82F9BE] w-fit rounded-sm font-main font-bold text-[10px] text-[#005235]">
                                        {epic.epic_id}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="pb-4">
                                    <h3 className="font-main font-semibold text-[17px] sm:text-[19px] text-[#041B3C] mb-3">
                                        {epic.title}
                                    </h3>

                                    <div className="flex items-center gap-2">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#65DCA4] text-[11px] font-bold text-[#002113]">
                                            {epic.assignee?.name
                                                ?.slice(0, 2)
                                                .toUpperCase() ?? "?"}
                                        </div>
                                        <div>
                                            <span className="font-main text-[11px] text-[#434654]">
                                                Assignee
                                            </span>
                                            <p className="font-main font-semibold text-[13px] text-[#041B3C]">
                                                {epic.assignee?.name ?? "Unassigned"}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="flex flex-wrap justify-between items-center border-t pt-3 gap-2">
                                    <div className="flex items-center gap-1.5">
                                        <UserPen className="w-3 h-3 text-[#434654CC]" />
                                        <p className="font-main text-[11px] text-[#434654CC]">
                                            Created by:
                                            <span className="font-semibold text-[#041B3C] ml-1">
                                                {epic.created_by?.name ?? "Unknown"}
                                            </span>
                                        </p>
                                    </div>

                                    <span className="flex items-center gap-1 font-main text-[11px] text-[#434654CC]">
                                        <Calendar className="w-3 h-3" />
                                        {epic.created_at ? new Date(epic.created_at).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        }) : "—"}
                                    </span>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {total > 0 && (
                <div className="mt-6 px-4 sm:px-6 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="font-main text-[13px] text-[#4F5F7B]">
                        Showing {pageData.length} of {total} epics
                    </p>

                    {totalPages > 1 && (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E5E8F0] bg-white text-[#4F5F7B] hover:bg-[#F2F5FF] disabled:opacity-40 disabled:cursor-not-allowed"
                                aria-label="Previous page"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    aria-current={p === page ? "page" : undefined}
                                    className={
                                        "flex h-8 w-8 items-center justify-center rounded-md text-[13px] font-semibold border " +
                                        (p === page
                                            ? "bg-[#003D9B] text-white border-[#003D9B]"
                                            : "bg-white text-[#4F5F7B] border-[#E5E8F0] hover:bg-[#F2F5FF]")
                                    }
                                >
                                    {p}
                                </button>
                            ))}

                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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

            <EpicDetailsDialog
                epic={
                    selectedEpic
                        ? {
                            ...selectedEpic,
                            tasks: projectTasks
                                .filter((t: TaskItem) => t.epic_id === selectedEpic.id)
                                .map((t: TaskItem) => ({
                                    id: t.id,
                                    title: t.title,
                                    status: t.status,
                                    assignee: t.assignee ?? (t.assignee_name ? { name: t.assignee_name } : undefined),
                                    due_date: t.due_date,
                                })),
                        }
                        : null
                }
                projectId={projectid}
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
                onAddTask={() => {
                    setDetailsOpen(false);
                    setCreateTaskOpen(true);
                }}
            />

            <Dialog open={createTaskOpen} onOpenChange={setCreateTaskOpen}>
                <DialogContent className="sm:max-w-2xl bg-white p-6 sm:p-8 rounded-2xl max-h-[90vh] overflow-y-auto">
                    <DialogTitle className="sr-only">Create New Task</DialogTitle>
                    <CreateTaskForm
                        projectId={projectid}
                        epicId={selectedEpic?.id}
                        onClose={() => {
                            setCreateTaskOpen(false);
                            setDetailsOpen(true);
                        }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}
