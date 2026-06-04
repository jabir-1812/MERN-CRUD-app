import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import api from '../../api/axios';
import {Link} from "react-router-dom"

export default function Home() {

    const {user, loading} = useSelector((state)=> state.auth)
    console.log("user==", user)
    console.log("loding==", loading)

    const dispatch = useDispatch();

    const handleLogout = async () => {

        try {

            await api.post("/user/logout");

            dispatch(logout());

        } catch (error) {
            console.log(error);
        }
    };

    if(loading){
        return (
            <h2>Loading...</h2>
        )
    }
  return (
    <div>
        <h1>User Home page</h1>
        <h2>Welcome 🎉{user?.name}</h2>
        <div>
            <button onClick={handleLogout}>Logout</button>
        </div>
        <div>
            <button>
                <Link to="/user/profile">Profile</Link>
            </button>
        </div>
    </div>
  )
}
