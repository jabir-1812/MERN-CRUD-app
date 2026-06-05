import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export default function Profile() {
    const {user, loading} = useSelector((state)=> state.auth)
    if(loading){
            return (
                <h2>Loading...</h2>
            )
        }
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">

                {/* Header */}
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">Profile</h1>

                {/* Profile image */}
                <div className="flex justify-center mb-4">
                {user?.profileImage ? (
                    <img
                    src={`http://localhost:5000/${user.profileImage}`}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100 shadow-sm"
                    />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-500">
                    {user?.name?.charAt(0).toUpperCase()}
                    </div>
                )}
                </div>

                {/* User info */}
                <div className="mb-6">
                <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
                </div>

                {/* Action button */}
                <Link
                to="/user/edit-profile"
                className="flex items-center justify-between w-full px-5 py-3 rounded-xl border border-indigo-200 text-indigo-700 font-medium text-sm hover:bg-indigo-50 active:scale-[0.98] transition-all duration-150"
                >
                <span>Edit Profile</span>
                <span className="text-indigo-400 text-lg">→</span>
                </Link>

                {/* Action button */}
                <Link
                to="/user/home"
                className="mt-5 flex items-center justify-between w-full px-5 py-3 rounded-xl border border-indigo-200 text-indigo-700 font-medium text-sm hover:bg-indigo-50 active:scale-[0.98] transition-all duration-150"
                >
                <span>Go to Home</span>
                <span className="text-indigo-400 text-lg">→</span>
                </Link>

            </div>
        </div>
    )
}
