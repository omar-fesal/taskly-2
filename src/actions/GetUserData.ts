import AxiosInstance from "@/lib/AxiosBase";

export default async function GetUserData() {
     try {
         const resp = await AxiosInstance.get('/auth/v1/user')
         return resp.data;
    } catch (error) {
console.log(error);

     }
 }