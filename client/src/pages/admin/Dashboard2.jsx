import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { adminLogout } from "../../features/auth/adminAuthSlice";
import adminApi from "../../api/adminAxios";
import { fetchUsers, deleteUser, undeleteUser,  setSearchTerm, setCurrentPage } from "../../features/adminSide/usersSlice";
import { Link } from "react-router-dom";
import toast from "react-hot-toast"

export default function Dashboard2() {
    const {adminData,  adminDashboardLoading } = useSelector((state)=> state.adminAuth)
    // console.log("admin dashboard loading...", adminDashboardLoading)

    const dispatch = useDispatch();

    async function handleLogout(){
        try {
            await adminApi.post("/admin/logout");
            dispatch(adminLogout());
            toast.success("Logged out successfully")
        } catch (error) {
            console.log(error)
        }
    }

    const { usersList, loading, error, searchTerm, currentPage, totalPages, totalUsers } = useSelector((state)=> state.users)

    async function handleDeleteUser(userId, userName) {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${userName}?`
        );

        if (!confirmed) return;

        try {
            const result = await dispatch(deleteUser(userId)).unwrap();
            dispatch(fetchUsers({page: currentPage, search: searchTerm}))
            console.log("result from thunk:", result);
            // alert("User deleted successfully !");
            toast.success("User deleted successfully")

        } catch (error) {
            console.log(error);
            alert("Failed to delete user");
        }
    }

    async function handleUnDeleteUser(userId, userName) {
        const confirmed = window.confirm(
            `Are you sure you want to undelete ${userName}?`
        );

        if (!confirmed) return;

        try {
            const result = await dispatch(undeleteUser(userId)).unwrap();
            dispatch(fetchUsers({page: currentPage, search: searchTerm}))
            console.log("result from thunk:", result);
            // alert("User undeleted successfully !");
            toast.success("User undeleted successfully")

        } catch (error) {
            console.log(error);
            alert("Failed to undelete user");
        }
    }

    async function handleSearch(event) {
        try {
            dispatch(setSearchTerm(event.target.value))
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(()=>{
        dispatch(fetchUsers({search: searchTerm, page: currentPage}));
    }, [dispatch, currentPage]);


    useEffect(()=>{
        const timer = setTimeout(()=>{
            dispatch(fetchUsers({search: searchTerm, page: currentPage}))
        }, 500)

        return ()=>{
            clearInterval(timer)
        }
    }, [searchTerm])


    if(error){
        return (
            <div>
                error fetching users {error}
            </div>
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
                    value={searchTerm}
                    onChange={handleSearch}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-600 bg-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                />
                <Link
                    to="/admin/create-new-user"
                    className="px-4 py-2.5 rounded-lg bg-yellow-500 text-gray-900 text-sm font-semibold text-center hover:bg-yellow-400 active:scale-[0.98] transition-all duration-150 whitespace-nowrap"
                >
                    + Create New User
                </Link>
            </div>

            {loading && <p>Loading....</p>}


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
                            <p className="text-xs text-gray-400 truncate">status: {user.isDeleted ? <span className='text-red-500/80 font-medium'>deleted</span> : <span className='text-green-500/80 font-medium'>active</span>}</p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 flex-shrink-0">
                            <Link
                            to={`/admin/edit-user/${user._id}`}
                            className="px-3 py-1.5 rounded-lg border border-gray-600 text-gray-300 text-xs font-medium hover:bg-gray-700 active:scale-[0.98] transition-all duration-150"
                            >
                            Edit
                            </Link>
                            {user.isDeleted ? (
                                <button
                                    onClick={() => handleUnDeleteUser(user._id, user.name)}
                                    className="px-3 py-1.5 rounded-lg border border-green-500/30 text-green-400 text-xs font-medium hover:bg-green-500/10 active:scale-[0.98] transition-all duration-150"
                                    >
                                    Undelete
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleDeleteUser(user._id, user.name)}
                                    className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/10 active:scale-[0.98] transition-all duration-150"
                                    >
                                    Delete
                                </button>
                            ) 
                            
                            }
                        </div>
                    </div>
                ))}
            </div>


            {/* Pagination */}
            <div className="flex items-center justify-center gap-4 mt-8">
                <button
                    disabled={currentPage === 1}
                    onClick={()=> dispatch(setCurrentPage(currentPage - 1))}
                    className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 text-sm font-medium hover:bg-gray-700 active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                    ← Previous
                </button>

                <span className="text-sm text-gray-400">
                    Page <span className="text-white font-semibold">{currentPage}</span> of{" "}
                    <span className="text-white font-semibold">{totalPages}</span>
                </span>

                <button
                    disabled={currentPage === totalPages}
                    onClick={()=> dispatch(setCurrentPage(currentPage + 1))}
                    className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 text-sm font-medium hover:bg-gray-700 active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                    Next →
                </button>
            </div>
        </div>        
    </div>
  )
}
