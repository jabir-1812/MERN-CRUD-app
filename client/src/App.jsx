
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials, setLoading } from "./features/auth/authSlice";
import api from "./api/axios";
import adminApi from "./api/adminAxios";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Index from "./pages/Index";
import UserLayout from "./pages/user/UserLayout";
import AdminLayout from "./pages/admin/AdminLayout";
import Register from "./pages/user/Register";
import Login from "./pages/user/Login";
import UserHome from './pages/user/Home';
import NotFound from "./pages/NotFound";
import PublicRoute from "./pages/user/PublicRoute";
import ProtectedRoute from "./pages/user/ProtectedRoute";
import AdminLoginPage from "./pages/admin/Login";
import AdminDashboardPage from "./pages/admin/Dashboard2";
import { setAdminCredentials, setAdminDashboardLoading } from "./features/auth/adminAuthSlice";
import AdminPublicRoute from "./pages/admin/AdminPublicRoute";
import AdminProtectedRoute from "./pages/admin/AdminProtectedRoute";
import ProfilePage from "./pages/user/Profile";
import EditProfilePage from "./pages/user/EditProfile";
import EditUserPage from "./pages/admin/EditUser";
import CreateUserPage from "./pages/admin/CreateUser";


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Index />}></Route>

                {/* user layout */}
                <Route path="/user" element={<UserLayout/>}>
                    <Route path="register" element={<Register />} ></Route>
                    
                    {/* public route */}
                    <Route element={<PublicRoute/>}>
                        <Route path="login" element={<Login/>}></Route>
                    </Route>

                    {/* protected route */}
                    <Route element={<ProtectedRoute/>}>
                        <Route path="home" element={<UserHome/>}></Route>
                        <Route path="profile" element={<ProfilePage/>}></Route>
                        <Route path="edit-profile" element={<EditProfilePage/>}></Route>
                    </Route>    
                </Route>
                
                {/* admin layout */}
                <Route path="/admin" element={<AdminLayout/>}>

                    {/* admin public route */}
                    <Route element={<AdminPublicRoute/>}>
                        <Route path="login" element={<AdminLoginPage/>}></Route>
                    </Route>

                    {/* admin protected route */}
                    <Route element={<AdminProtectedRoute/>}>
                        <Route path="dashboard" element={<AdminDashboardPage/>} ></Route>
                        <Route path="edit-user/:userId" element={<EditUserPage/>} ></Route>
                        <Route path="create-new-user" element={<CreateUserPage/>} ></Route>
                    </Route>
                </Route>


                <Route path="*" element={<NotFound />} ></Route>
            </Routes>
        </BrowserRouter>
    );
}