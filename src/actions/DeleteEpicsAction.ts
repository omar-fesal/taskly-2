import AxiosInstance from "@/lib/AxiosBase";

export default async function DeleteEpic(id: string) {
    try {
        const resp = await AxiosInstance.delete("/rest/v1/epics?id=eq." + id)
        return resp
    } catch (error) {
        throw (error)
    }
}