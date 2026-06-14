import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute() {

    const { accessToken, loading } = useSelector((state) => state.auth);

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return accessToken
        ? <Outlet/>
        : <Navigate to="/user/login" replace />;
}