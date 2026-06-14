import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PublicRoute() {

    const { accessToken, loading } = useSelector((state) => state.auth);

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return accessToken
        ? <Navigate to="/user/home" replace />
        : <Outlet/>
}