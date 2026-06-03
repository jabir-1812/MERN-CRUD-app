import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import adminApi from '../../api/adminAxios';
import { adminLogout } from '../../features/auth/adminAuthSlice';

export default function Dashboard() {

    const {adminData, adminDashboardLoading} = useSelector((state)=> state.adminAuth)
    console.log("adminData==", adminData)

    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await adminApi.post("/admin/logout");
            dispatch(adminLogout());
        } catch (error) {
            console.log(error);
        }
    };

    if(adminDashboardLoading){
        return(
            <h2>Admin Dashboard is loading...</h2>
        )
    }

  return (
    <div>
        <h1>Admin Dashboard</h1>
        <h1>Welcome 🎉 {adminData?.name}</h1>
        <div><button onClick={handleLogout}>Logout</button></div>
    </div>
  )
}
