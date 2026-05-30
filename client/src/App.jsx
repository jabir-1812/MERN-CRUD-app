import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Index from "./pages/Index";
import Register from "./pages/user/Register";
import Login from "./pages/user/Login";
import UserHome from './pages/user/Home';
import NotFound from "./pages/NotFound";

export default function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route index path='/' element={<Index />} />
                <Route path="/user/register" element={<Register />} />
                <Route path="/user/login" element={<Login />} />
                <Route path="/user/home" element={<UserHome/>} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}