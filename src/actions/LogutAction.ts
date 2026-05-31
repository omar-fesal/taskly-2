import AxiosInstance from "@/lib/AxiosBase";


export default async function LogoutAction() {
    try {
        const resp = await AxiosInstance.post('/auth/v1/logout')

        return resp
    } catch (error) {
        throw (error)
    }
}