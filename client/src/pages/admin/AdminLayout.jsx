import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom'
import adminApi from '../../api/adminAxios';
import { setAdminCredentials, setAdminDashboardLoading } from '../../features/auth/adminAuthSlice';

export default function AdminLayout() {
    const dispatch = useDispatch();

    useEffect(() => {
        const verifyLogin = async () => {
            try {
                const adminResponse = await adminApi.post('/admin/refresh-token');
                // console.log("admin response data, ", adminResponse.data);

                dispatch(setAdminCredentials({
                    adminAccessToken: adminResponse.data.adminAccessToken,
                    adminData: adminResponse.data.adminData
                }));
            } catch (error) {
                console.error(error)
                console.log("error:",error?.response?.data?.message);
            }finally{
                dispatch(setAdminDashboardLoading(false));
            }
        };

        verifyLogin();
    }, []);
  return (
    <Outlet/>
  )
}
