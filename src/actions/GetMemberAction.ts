import AxiosInstance from "@/lib/AxiosBase";

export default async function GetMemberAction(id: string) {
    try {
        const resp = await AxiosInstance.get(`/rest/v1/get_project_members?project_id=eq.${id}`)
        return resp.data
    } catch (error) {
        throw (error)
    }
}