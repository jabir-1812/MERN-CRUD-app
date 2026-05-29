import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";

export default function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route index path='/' element={<Index />} />
                <Route path="/user/register" element={<Register />} />
                <Route path="/user/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}