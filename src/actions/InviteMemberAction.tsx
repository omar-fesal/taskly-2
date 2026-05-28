import AxiosInstance from "@/lib/AxiosBase";

export interface InviteMemberPayload {
    p_email: string;
    p_project_id: string;
    p_app_url: string;
    p_base_url: string;

}


export default async function InviteMemberAction(data: InviteMemberPayload) {
    try {
        const resp = await AxiosInstance.post('/rest/v1/epics', {
            p_email: data.p_email,
            p_project_id: data.p_project_id,
            p_app_url: data.p_app_url,
            p_base_url: data.p_base_url,

        });

        return resp.data;

    } catch (error: any) {
        console.log(error.response?.data || error.message);
        throw error;
    }
}