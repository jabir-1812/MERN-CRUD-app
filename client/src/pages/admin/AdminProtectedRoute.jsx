import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';


export default function adminProtectedRoute() {
    const { adminAccessToken, adminDashboardLoading} = useSelector((state)=> state.adminAuth);

    if(adminDashboardLoading){
        return <h1>Loading...</h1>
    }
  return adminAccessToken
    ? <Outlet/>
    : <Navigate to="/admin/login" replace />
}
