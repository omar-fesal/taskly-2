import AxiosInstance from "@/lib/AxiosBase";

interface EditProjectProps {
    id: string;
    name: string;
    description: string;
}

export default async function EditProjectAction(data: EditProjectProps) {
    try {
        const resp = await AxiosInstance.patch(`/rest/v1/projects?id=eq.${data.id}`, {
            name: data.name,
            description: data.description
        });
        return resp.data;
    } catch (error) {
        throw error;
    }
}
