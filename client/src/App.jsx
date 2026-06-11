import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials, setLoading } from "./features/auth/authSlice";
import api from "./api/axios";
import adminApi from "./api/adminAxios";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Index from "./pages/Index";
import Register from "./pages/user/Register";
import Login from "./pages/user/Login";
import UserHome from './pages/user/Home';
import NotFound from "./pages/NotFound";
import PublicRoute from "./pages/user/PublicRoute";
import ProtectedRoute from "./pages/user/ProtectedRoute";
import AdminLoginPage from "./pages/admin/Login";
import AdminDashboardPage from "./pages/admin/Dashboard2";
import { setAdminCredentials, setAdminDashboardLoading } from "./features/auth/adminAuthSlice";
import AdminProtectedRoute from "./pages/admin/AdminProtectedRoute";
import ProfilePage from "./pages/user/Profile";
import EditProfilePage from "./pages/user/EditProfile";
import EditUserPage from "./pages/admin/EditUser";
import CreateUserPage from "./pages/admin/CreateUser";


export default function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const verifyLogin = async () => {
            try {
                const response = await api.post('/user/refresh-token');
                // console.log("response data", response.data)

                dispatch(setCredentials({
                    accessToken: response.data.accessToken,
                    user: response.data.user
                }));
            } catch (error) {
                console.log("user is not logged in, error in App()==> ", error);
            } finally {
                dispatch(setLoading(false));
            }


            try {
                const adminResponse = await adminApi.post('/admin/refresh-token');
                // console.log("admin response data, ", adminResponse.data);

                dispatch(setAdminCredentials({
                    adminAccessToken: adminResponse.data.adminAccessToken,
                    adminData: adminResponse.data.adminData
                }));
            } catch (error) {
                console.log("admin is not logged in, error in App()==> ", error);
            }finally{
                dispatch(setAdminDashboardLoading(false));
            }
        };

        verifyLogin();
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route index path='/' element={<Index />} />
                <Route path="/user/register" element={<Register />} />
                <Route
                    path="/user/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/user/home"
                    element={
                        <ProtectedRoute>
                            <UserHome />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/user/edit-profile"
                    element={
                        <ProtectedRoute>
                            <EditProfilePage />
                        </ProtectedRoute>
                    }
                />

                <Route path="/admin/login" element={<AdminLoginPage/>} />
                <Route 
                    path="/admin/dashboard" 
                    element={
                        <AdminProtectedRoute>
                            <AdminDashboardPage/>
                        </AdminProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/edit-user/:userId" 
                    element={
                        <AdminProtectedRoute>
                            <EditUserPage/>
                        </AdminProtectedRoute>
                    } 
                />

                <Route 
                    path="/admin/create-new-user" 
                    element={
                        <AdminProtectedRoute>
                            <CreateUserPage/>
                        </AdminProtectedRoute>
                    } 
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}