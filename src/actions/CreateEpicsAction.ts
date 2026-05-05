import AxiosInstance from "@/lib/AxiosBase";

export interface CreateEpicPayload {
    title: string;
    description: string;
    assignee_id: string;
    project_id: string;
    deadline: string; // ISO date string (YYYY-MM-DD)
}


export default async function CreateEpicsAction(data: CreateEpicPayload) {
    try {
        const resp = await AxiosInstance.post('/rest/v1/epics', {
            title: data.title,
            description: data.description,
            assignee_id: data.assignee_id,
            project_id: data.project_id,
            deadline: data.deadline
        });

        return resp.data;

    } catch (error: any) {
        console.log(error.response?.data || error.message);
        throw error;
    }
}