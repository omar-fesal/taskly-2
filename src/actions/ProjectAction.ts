'use client'

import AxiosInstance from "@/lib/AxiosBase";

export async function ProjectAction() {

    try {

        const response = await AxiosInstance.get('/rest/v1/rpc/get_projects')
        return response.data
    } catch (error: any) {

        throw error;
    }

}