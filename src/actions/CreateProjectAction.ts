import AxiosInstance from "@/lib/AxiosBase";

interface CreateProjectProps {
    name: string;
    description: string;
}
export default async function CreateProjectAction(data: CreateProjectProps) {
    try {
        const resp = await AxiosInstance.post('/rest/v1/projects', {
            name: data.name,
            description: data.description
        })
        console.log(resp);
        return resp.data
    } catch (error) {
        throw (error)
    }
}