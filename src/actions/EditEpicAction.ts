import AxiosInstance from "@/lib/AxiosBase";

interface EditProjectProps {
    id: string;
    title: string;
    description: string;
}

export default async function EditEpicAction(data: EditProjectProps) {
    try {
        const resp = await AxiosInstance.patch(
            `/rest/v1/epics?id=eq.${data.id}&select=project_id`,
            {
                title: data.title,
                description: data.description
            }
        );

        return resp.data[0];
    } catch (error) {
        throw error;
    }
}