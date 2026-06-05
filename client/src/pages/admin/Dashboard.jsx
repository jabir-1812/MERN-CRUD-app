import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import adminApi from '../../api/adminAxios';
import { adminLogout } from '../../features/auth/adminAuthSlice';
import { Link } from 'react-router-dom';

export default function Dashboard() {

    const {adminData, adminDashboardLoading} = useSelector((state)=> state.adminAuth)
    console.log("adminData==", adminData)

    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await adminApi.post("/admin/logout");
            dispatch(adminLogout());
        } catch (error) {
            console.log(error);
        }
    };

    
    const [usersList, setUsersList] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState('');
    const [totalPages, setTotalPages] = useState(1)
    const [page, setPage] = useState(1);


    const handleDeleteUser = async (userId, userName) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${userName}?`
        );

        if (!confirmed) return;

        try {
            await adminApi.delete(`/admin/delete-user/${userId}`);

            setUsersList((prevUsers) =>
                prevUsers.filter((user) => user._id !== userId)
            );

            alert("User deleted successfully");
        } catch (error) {
            console.log(error);
            alert("Failed to delete user");
        }
    };

    useEffect(()=>{
        if(!adminData) return;
        async function fetchUsersList() {
            try {
                const response = await adminApi.get(`/admin/users-list?page=${page}&search=${searchTerm}`);
                console.log("response data users list", response.data)
                setUsersList(response.data.usersList)
                setTotalPages(response.data.totalPages)
            } catch (error) {
                console.log("error in fetchUsersList() ==> ", error)
                console.log("status:", error.response?.status);
                console.log("data:", error.response?.data);
            }
        }

        fetchUsersList();
    },[adminData, page, searchTerm]);

    useEffect(()=>{
        const timer = setTimeout(()=>{
            setSearchTerm(searchInput);
            setPage(1);
        }, 500)

        return()=>clearTimeout(timer)
    }, [searchInput])

    if(adminDashboardLoading){
        return(
            <h2>Admin Dashboard is loading...</h2>
        )
    }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8">
        <div className="max-w-3xl mx-auto">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Admin Dashboard</h1>
                <p className="mt-0.5 text-sm text-gray-400">
                Welcome back, <span className="text-yellow-400 font-semibold">{adminData?.name}</span> 🎉
                </p>
            </div>
            <button
                onClick={handleLogout}
                className="self-start sm:self-auto px-4 py-2 rounded-lg border border-gray-600 text-gray-300 text-sm font-medium hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-400 active:scale-[0.98] transition-all duration-150"
            >
                Logout
            </button>
            </div>

            {/* Search & Create */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
                type="text"
                placeholder="Search users..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-600 bg-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
            />
            <Link
                to="/admin/create-new-user"
                className="px-4 py-2.5 rounded-lg bg-yellow-500 text-gray-900 text-sm font-semibold text-center hover:bg-yellow-400 active:scale-[0.98] transition-all duration-150 whitespace-nowrap"
            >
                + Create New User
            </Link>
            </div>

            {/* Users List */}
            <div className="space-y-3">
            {usersList.map((user) => (
                <div
                key={user._id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 bg-gray-800 border border-gray-700 rounded-xl px-5 py-4"
                >
                {/* Avatar */}
                <div className="flex-shrink-0">
                    {user?.profileImage ? (
                    <img
                        src={`http://localhost:5000/${user.profileImage}`}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                    />
                    ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center text-lg font-bold text-gray-300">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>
                    )}
                </div>

                {/* User info */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 flex-shrink-0">
                    <Link
                    to={`/admin/edit-user/${user._id}`}
                    className="px-3 py-1.5 rounded-lg border border-gray-600 text-gray-300 text-xs font-medium hover:bg-gray-700 active:scale-[0.98] transition-all duration-150"
                    >
                    Edit
                    </Link>
                    <button
                    onClick={() => handleDeleteUser(user._id, user.name)}
                    className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/10 active:scale-[0.98] transition-all duration-150"
                    >
                    Delete
                    </button>
                </div>
                </div>
            ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-4 mt-8">
            <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 text-sm font-medium hover:bg-gray-700 active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
                ← Previous
            </button>

            <span className="text-sm text-gray-400">
                Page <span className="text-white font-semibold">{page}</span> of{" "}
                <span className="text-white font-semibold">{totalPages}</span>
            </span>

            <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 text-sm font-medium hover:bg-gray-700 active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
                Next →
            </button>
            </div>

        </div>
        </div>
  )
}
