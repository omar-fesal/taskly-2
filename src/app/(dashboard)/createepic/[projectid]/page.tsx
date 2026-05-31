"use client"

import CreateEpicsForm from "@/components/ui/CreateEpicsForm/CreateEpicsForm";
import GetMemberAction from "@/actions/GetMemberAction";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CreateEpicPage() {
    const params = useParams();
    const projectid = params?.projectid as string;

    const { data: members = [], isLoading } = useQuery({
        queryKey: ["members", projectid],
        queryFn: () => GetMemberAction(projectid)
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <main className="px-4 py-4 sm:px-6 sm:py-6 max-w-4xl">
            <CreateEpicsForm projectid={projectid} members={members} />
        </main>
    );
}
