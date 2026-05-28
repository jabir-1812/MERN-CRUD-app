import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";

export default function App() {

  return (
    <BrowserRouter>

      <Routes>
        <Route path='/' element = {<Home/>} /> 

        <Route path="/user/register" element={<Register />} />

        <Route path="/user/login" element={<Login />} />

      </Routes>

    </BrowserRouter>
  );
}

function Home(){
    return(
        <>
        <h1>Home Page</h1>
        <Link to="/user/register">Register</Link>
        </>
    )
}