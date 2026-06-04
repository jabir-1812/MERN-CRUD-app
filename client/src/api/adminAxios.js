import axios from "axios";
import { store } from "../app/store";
import { adminLogout, setAdminCredentials } from "../features/auth/adminAuthSlice";

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


adminApi.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/admin/refresh-token')
        ) {
            originalRequest._retry = true;

            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/admin/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = response.data.adminAccessToken;

                store.dispatch(
                    setAdminCredentials({
                        adminAccessToken: newAccessToken,
                        adminData: response.data.adminData
                    })
                );

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return adminApi(originalRequest);
            } catch (refreshError) {
                // Refresh token also expired
                store.dispatch(adminLogout());
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default adminApi;