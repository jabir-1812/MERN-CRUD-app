import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import api from '../../api/axios';
import { setCredentials, setLoading } from '../../features/auth/authSlice';
import { Outlet } from 'react-router-dom';

export default function UserLayout() {
    const dispatch = useDispatch();

    useEffect(() => {
        const verifyLogin = async () => {
            console.log("verify login running...")
            try {
                const response = await api.post('/user/refresh-token');
                // console.log("response data", response.data)

                dispatch(setCredentials({
                    accessToken: response.data.accessToken,
                    user: response.data.user
                }));
            } catch (error) {
                console.error(error)
                console.log("error:", error?.response?.data?.message);
            } finally {
                dispatch(setLoading(false));
            }
        };

        verifyLogin();
    }, []);

  return (
    <Outlet/>
  )
}
