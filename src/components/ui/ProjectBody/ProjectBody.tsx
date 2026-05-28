"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ProjectAction } from '@/actions/ProjectAction';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    Loader2,
    MoreHorizontal,
    Plus,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMemo, useState } from "react";

export interface ProjectsInterface {
    id: string;
    name: string;
    description: string;
    created_by: string;
    created_at: string;
}

const PAGE_SIZE = 5;

export default function ProjectBody() {
    const [page, setPage] = useState(1);

    const { data, isLoading, error, refetch } = useQuery<ProjectsInterface[]>({
        queryKey: ["projects"],
        queryFn: ProjectAction,
    });

    const total = data?.length ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    const pageData = useMemo(() => {
        if (!data) return [];
        const start = (page - 1) * PAGE_SIZE;
        return data.slice(start, start + PAGE_SIZE);
    }, [data, page]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center">
                <Loader2 className="w-10 h-10 animate-spin text-slate-500" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center">
                <div className="bg-red-100 p-5 rounded-2xl mb-4">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    Something went wrong
                </h2>

                <p className="text-muted-foreground max-w-sm mb-6">
                    We&apos;re having trouble retrieving your projects right now.
                    Please try again in a moment.
                </p>

                <Button onClick={() => refetch()}>
                    Retry Connection
                </Button>
            </div>
        )
    }

    return (
        <div className="px-4 sm:px-5 pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pageData.map((project) => (
                    <Card
                        key={project.id}
                        className="w-full flex flex-col relative bg-white border border-[#E5E8F0] rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    >
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className="absolute top-3 right-3 z-10 p-1 rounded-md hover:bg-gray-100"
                                    aria-label="Project actions"
                                >
                                    <MoreHorizontal className="w-5 h-5 cursor-pointer text-[#73768599]" />
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href={'/editproject/' + project.id}>
                                        Edit
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Link
                            href={'/projects/' + project.id}
                            className="flex flex-col flex-1"
                        >
                            <CardHeader className="pr-10">
                                <CardTitle className="font-main font-bold text-[18px] text-[#041B3C] leading-snug">
                                    {project.name}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="flex-1">
                                <p className="font-main text-[14px] text-[#4F5F7B] leading-relaxed line-clamp-3">
                                    {project.description}
                                </p>
                            </CardContent>

                            <CardFooter className="flex justify-between items-center border-t pt-4 mt-2">
                                <p className="font-main font-bold text-[11px] tracking-wide text-[#43465499]">
                                    CREATED AT
                                </p>
                                <span className="font-main font-semibold text-[13px] text-[#041B3C]">
                                    {new Date(project.created_at).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </span>
                            </CardFooter>
                        </Link>
                    </Card>
                ))}

                {/* Add Project tile */}
                <Link
                    href="/createproject"
                    className="group flex flex-col items-center justify-center gap-3 w-full min-h-[200px] rounded-xl border border-dashed border-[#C7CEDB] bg-white hover:border-[#003D9B] hover:bg-[#F2F5FF] transition-colors"
                >
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#F2F5FF] text-[#003D9B] group-hover:bg-white">
                        <Plus className="w-5 h-5" />
                    </span>
                    <span className="font-main font-bold text-[12px] tracking-wider text-[#43465499] group-hover:text-[#003D9B]">
                        ADD PROJECT
                    </span>
                </Link>
            </div>

            {/* Pagination footer */}
            {total > 0 && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="font-main text-[13px] text-[#4F5F7B]">
                        Showing {pageData.length} of {total} active projects
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
        </div>
    )
}
