import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AxiosInstance from "@/lib/AxiosBase";
import { Calendar, Plus, Search, UserPen } from "lucide-react";
import { Params } from "next/dist/server/request/params";
import Link from "next/link";


import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"

import { Label } from "@/components/ui/label"
import CreateEpicsForm from "@/components/ui/CreateEpicsForm/CreateEpicsForm";


export default async function ProjectDetails({ params }: { params: Params }) {
    const { projectid } = await params
    const { data } = await AxiosInstance.get(`/rest/v1/project_epics?project_id=eq.${projectid}`)
    const { data: data2 } = await AxiosInstance.get(`/rest/v1/get_project_members?project_id=eq.${projectid}`)
    const { data: data3 } = await AxiosInstance.get(`/rest/v1/get_project_members?project_id=eq.${projectid}`)

    return <>
        <div>
            <Link href={'/projects'} className='font-main font-bold text-[12px] text-[#43465499]'>
                PROJECTS &gt;
            </Link>

            <span className='font-main font-bold text-[12px] text-[#43465499]'> PR0JECT NAME &gt;</span>
            <span className='font-main font-bold text-[12px] text-[#003D9B]'> EPICS</span>

        </div>

        <div className='flex justify-between p-5'>
            <div className='flex flex-col'>
                <h2 className='font-main font-semibold text-[30px] text-[#041B3C]'>
                    Project Epics
                </h2>


                <p className='font-main text-[16px] text-[#434654]'>

                </p>

            </div>

            <div className="flex items-center gap-3">
                <div className="relative w-full max-w-xs">
                    <Input
                        type="search"
                        placeholder="Search epics..."
                        className="pl-9 h-12 bg-[#D7E2FF] focus:bg-[#D7E2FF]"
                    />
                    <Search className="absolute top-3 left-0 pl-1 text-[#737685]" />
                </div>




                <Dialog
                >
                    <DialogTrigger asChild>
                        <Button className="px-4 h-12 rounded-sm bg-[#003D9B] font-main font-semibold hover:bg-[#0052CC] whitespace-nowrap">
                            <Plus className="mr-2 w-4 h-4" />
                            New Epic
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-lg">


                        <CreateEpicsForm
                            projectid={projectid}
                            members={data2} />
                    </DialogContent>
                </Dialog>


            </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {data.map((epic: any) => (
                <Card key={epic.id} className="mx-auto w-xl max-w-xl border-l-4 border-[#004E32]">

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

                        <div className='flex  gap-2'>
                            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#65DCA4] text-[11px] font-bold text-[#002113] mt-1">
                                <span>
                                    {epic.assignee.name.slice(0, 2).toUpperCase()}
                                </span>
                            </div>

                            <div>
                                <span className='text-[12px] text-[#434654]'>Assignee</span>
                                <p className='font-semibold text-[14px]'>
                                    {epic.assignee.name}
                                </p>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between items-center">

                        {/* Created by */}
                        <div className="flex items-center gap-1.5">
                            <UserPen className='w-3 h-3' />
                            <p className='text-[11px]'>
                                Created by:
                                <span className='font-semibold ml-1'>
                                    {epic.created_by.name}
                                </span>
                            </p>
                        </div>

                        {/* Date */}
                        <span className="flex items-center gap-1 text-[11px] text-[#434654CC]">
                            <Calendar className="w-3 h-3" />
                            {new Date(epic.created_at).toLocaleDateString()}
                        </span>

                    </CardFooter>

                </Card>
            ))}
        </div>
    </>
}