import AxiosInstance from "@/lib/AxiosBase";

export default async function GetProjectTaskAction(id: string) {
    try {
        const resp = await AxiosInstance.get(`/rest/v1/project_tasks?project_id=eq.${id}`)
        return resp.data
    } catch (error) {
        throw (error)
    }
}