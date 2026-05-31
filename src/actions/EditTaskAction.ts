import AxiosInstance from "@/lib/AxiosBase";

interface EditTaskProps {
    id: string;
    status: string;

}

export default async function EditTaskAction(data: EditTaskProps) {
    try {
        const resp = await AxiosInstance.patch(`/rest/v1/tasks?id=eq.${data.id}`, {
            status: data.status,

        });
        return resp.data;
    } catch (error) {
        throw error;
    }
}
