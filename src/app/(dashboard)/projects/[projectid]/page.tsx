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
    MoreHorizontal,
    Plus,
    Search,
    UserPen
} from "lucide-react";

import Link from "next/link";

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import CreateEpicsForm from "@/components/ui/CreateEpicsForm/CreateEpicsForm";

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


export default function ProjectDetails() {
    const params = useParams();
    const projectid = params?.projectid as string;
    const queryClient = useQueryClient();

    // Get Epics
    const { data = [] } = useQuery({
        queryKey: ["epics", projectid],

        queryFn: () => GetEpicsCardAction(projectid as string)
    });

    // // Get Members
    const { data: members = [] } = useQuery({
        queryKey: ["members", projectid],

        queryFn: () => GetMemberAction(projectid as string)
    });

    // Delete Mutation
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

    return (
        <>
            <div className="px-4 pt-4 sm:px-5 sm:pt-5">
                <Link
                    href={'/projects'}
                    className='font-main font-bold text-[12px] text-[#43465499]'
                >
                    PROJECTS &gt;
                </Link>

                <span className='font-main font-bold text-[12px] text-[#43465499]'>
                    PROJECT NAME &gt;
                </span>

                <span className='font-main font-bold text-[12px] text-[#003D9B]'>
                    EPICS
                </span>
            </div>

            <div className='flex flex-col sm:flex-row sm:justify-between gap-4 p-4 sm:p-5'>

                <div className='flex flex-col'>
                    <h2 className='font-main font-semibold text-[22px] sm:text-[30px] text-[#041B3C]'>
                        Project Epics
                    </h2>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

                    <div className="relative w-full sm:w-auto sm:max-w-xs">
                        <Input
                            type="search"
                            placeholder="Search epics..."
                            className="pl-9 h-12 bg-[#D7E2FF] focus:bg-[#D7E2FF]"
                        />

                        <Search className="absolute top-3 left-2 w-4 h-4 text-[#737685]" />
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="px-4 h-12 rounded-sm bg-[#003D9B] font-main font-semibold hover:bg-[#0052CC] whitespace-nowrap">
                                <Plus className="mr-2 w-4 h-4" />
                                New Epic
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-lg">
                            <CreateEpicsForm
                                projectid={projectid}
                                members={members}
                            />
                        </DialogContent>
                    </Dialog>

                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 px-4 sm:px-5'>

                {data.map((epic: any) => (

                    <Card
                        key={epic.id}
                        className="relative w-full border-l-4 border-[#004E32]"
                    >

                        <DropdownMenu>

                            <DropdownMenuTrigger asChild>
                                <button className="absolute top-2 right-2 z-10 p-1 rounded-md hover:bg-gray-100">
                                    <MoreHorizontal className="w-5 h-5 cursor-pointer" />
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="center">

                                <DropdownMenuItem asChild>
                                    <Link href={`/editepics/${epic.id}`}>
                                        Edit
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => deleteMutation.mutate(epic.id)}
                                >
                                    Delete
                                </DropdownMenuItem>

                            </DropdownMenuContent>

                        </DropdownMenu>

                        <CardHeader>
                            <CardTitle className='py-1 px-2.5 bg-[#82F9BE] w-fit text-[10px]'>
                                {epic.epic_id}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className='border-b pb-6'>

                            <h2 className='font-semibold text-[20px]'>
                                {epic.title}
                            </h2>

                            <p className="text-sm text-gray-500 mb-3">
                                {epic.description}
                            </p>

                            <div className='flex gap-2'>

                                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#65DCA4] text-[11px] font-bold text-[#002113] mt-1">
                                    <span>
                                        {epic.assignee.name
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </span>
                                </div>

                                <div>
                                    <span className='text-[12px] text-[#434654]'>
                                        Assignee
                                    </span>

                                    <p className='font-semibold text-[14px]'>
                                        {epic.assignee.name}
                                    </p>
                                </div>

                            </div>

                        </CardContent>

                        <CardFooter className="flex justify-between items-center">

                            <div className="flex items-center gap-1.5">

                                <UserPen className='w-3 h-3' />

                                <p className='text-[11px]'>
                                    Created by:

                                    <span className='font-semibold ml-1'>
                                        {epic.created_by.name}
                                    </span>
                                </p>

                            </div>

                            <span className="flex items-center gap-1 text-[11px] text-[#434654CC]">

                                <Calendar className="w-3 h-3" />

                                {new Date(epic.created_at)
                                    .toLocaleDateString()}

                            </span>

                        </CardFooter>

                    </Card>
                ))}
            </div>
        </>
    )
}