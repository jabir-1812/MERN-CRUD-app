import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {

    const { accessToken, loading } =
        useSelector((state) => state.auth);

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return accessToken
        ? children
        : <Navigate to="/user/login" replace />;
}