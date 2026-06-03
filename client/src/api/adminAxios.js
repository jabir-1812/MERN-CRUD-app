import axios from "axios";
import { store } from "../app/store";

const adminApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});


adminApi.interceptors.request.use(
    (config)=>{
        const adminAccessToken = store.getState().adminAuth.adminAccessToken;

        if(adminAccessToken){
            config.headers.Authorization = `Bearer ${adminAccessToken}`
        }

        return config;
    }
)


export default adminApi;