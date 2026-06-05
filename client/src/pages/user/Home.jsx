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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">

            {/* Welcome section */}
            <div className="mb-8">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4 text-2xl">
                🎉
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">User Home</h1>
            <h2 className="mt-1 text-base text-gray-500">
                Welcome, <span className="text-indigo-600 font-semibold">{user?.name}</span>!
            </h2>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
            <Link
                to="/user/profile"
                className="flex items-center justify-between w-full px-5 py-3 rounded-xl border border-indigo-200 text-indigo-700 font-medium text-sm hover:bg-indigo-50 active:scale-[0.98] transition-all duration-150"
            >
                <span>View Profile</span>
                <span className="text-indigo-400 text-lg">→</span>
            </Link>

            <button
                onClick={handleLogout}
                className="w-full px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-red-50 hover:border-red-200 hover:text-red-600 active:scale-[0.98] transition-all duration-150"
            >
                Logout
            </button>
            </div>

        </div>
    </div>
  )
}
