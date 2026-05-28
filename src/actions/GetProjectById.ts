import AxiosInstance from "@/lib/AxiosBase";

export default async function GetProjectById(id: string) {
    try {
        const resp = await AxiosInstance.get(`/rest/v1/projects?id=eq.${id}`);
        return resp.data[0];
    } catch (error) {
        throw error;
    }
}
