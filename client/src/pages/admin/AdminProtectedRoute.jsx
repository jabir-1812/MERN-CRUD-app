import React from 'react'
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


export default function adminProtectedRoute({children}) {
    const { adminAccessToken, adminDashboardLoading} = useSelector((state)=> state.adminAuth);

    if(adminDashboardLoading){
        return <h1>Loading...</h1>
    }
  return adminAccessToken
    ? children
    : <Navigate to="/admin/login" replace />
}
