import AxiosInstance from "@/lib/AxiosBase";

export default async function GetEpicByIdAction(id: string) {
    try {
        const resp = await AxiosInstance.get(
            `/rest/v1/epics?id=eq.${id}&select=*`
        );

        return resp.data[0];
    } catch (error) {
        throw error;
    }
}