import axios from "axios";
import { store } from '../app/store';
import { logout, setCredentials } from "../features/auth/authSlice";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});


api.interceptors.request.use(
    (config)=>{
        const token = store.getState().auth.accessToken;

        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    }
)


api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/user/refresh-token')
        ) {
            originalRequest._retry = true;

            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/user/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = response.data.accessToken;

                store.dispatch(
                    setCredentials({
                        accessToken: newAccessToken,
                        user: response.data.user
                    })
                );

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                // Refresh token also expired
                store.dispatch(logout());
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;