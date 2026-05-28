import AxiosInstance from "@/lib/AxiosBase";

export default async function GetEpicsCardAction(id: string) {
    try {
        const resp = await AxiosInstance.get(`/rest/v1/project_epics?project_id=eq.${id}`)
        return resp.data
    } catch (error) {
        throw (error)
    }
}