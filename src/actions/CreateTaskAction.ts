import AxiosInstance from "@/lib/AxiosBase";

type CreateTaskProps = {
    project_id: string
    epic_id: string
    title: string
    description: string
    assignee_id: string
    due_date: string
    status: "TO_DO" | "IN_PROGRESS" | "DONE"
}

export default async function CreateTaskAction(data: CreateTaskProps) {
    try {
        const resp = await AxiosInstance.post("/rest/v1/tasks", {
            project_id: data.project_id,
            epic_id: data.epic_id,
            title: data.title,
            description: data.description,
            assignee_id: data.assignee_id,
            due_date: data.due_date,
            status: data.status,
        })

        return resp.data
    } catch (error) {
        console.log(error)
        throw error
    }
}