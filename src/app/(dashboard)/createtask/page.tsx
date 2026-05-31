"use client"

import CreateTaskForm from "@/components/ui/CreateTaskForm/CreateTaskForm"
import { useSearchParams } from "next/navigation"

export default function CreateTaskPage() {
    const searchParams = useSearchParams()

    const projectId = searchParams.get("projectId") ?? undefined
    const epicId = searchParams.get("epicId") ?? undefined

    return (
        <main className="px-4 py-4 sm:px-6 sm:py-6 max-w-4xl">
            <CreateTaskForm projectId={projectId} epicId={epicId} />
        </main>
    )
}
