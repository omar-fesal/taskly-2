import AxiosInstance from "@/lib/AxiosBase";

export default async function DeleteTaskAction(id: string) {
    try {
        const resp = await AxiosInstance.delete("/rest/v1/tasks?id=eq." + id)
        return resp
    } catch (error) {
        throw (error)
    }
}