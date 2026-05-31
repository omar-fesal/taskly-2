"use client"

import CreateTaskForm from "@/components/ui/CreateTaskForm/CreateTaskForm"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function CreateTaskFormWrapper() {
    const searchParams = useSearchParams()
    const projectId = searchParams.get("projectId") ?? undefined
    const epicId = searchParams.get("epicId") ?? undefined

    return <CreateTaskForm projectId={projectId} epicId={epicId} />
}

export default function CreateTaskPage() {
    return (
        <main className="px-4 py-4 sm:px-6 sm:py-6 max-w-4xl">
            <Suspense fallback={<div>Loading...</div>}>
                <CreateTaskFormWrapper />
            </Suspense>
        </main>
    )
}
