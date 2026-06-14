import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PublicRoute() {

    const { adminAccessToken, adminDashboardLoading } = useSelector((state) => state.adminAuth);

    if (adminDashboardLoading) {
        return <h1>Loading...</h1>;
    }

    return adminAccessToken
        ? <Navigate to="/admin/dashboard" replace />
        : <Outlet/>;
}