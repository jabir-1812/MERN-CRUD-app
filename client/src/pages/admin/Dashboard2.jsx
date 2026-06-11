import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { adminLogout } from "../../features/auth/adminAuthSlice";
import adminApi from "../../api/adminAxios";
import { fetchUsers, deleteUser, setCurrentPage } from "../../features/adminSide/usersSlice";
import { Link } from "react-router-dom";

export default function Dashboard2() {
    const { adminDashboardLoading } = useSelector((state)=> state.adminAuth)
    // console.log("admin dashboard loading...", adminDashboardLoading)

    const dispatch = useDispatch();

    async function handleLogout(){
        try {
            await adminApi.post("/admin/logout");
            dispatch(adminLogout());
        } catch (error) {
            console.log(error)
        }
    }

    const { usersList, loading, error, currentPage, totalPages, totalUsers } = useSelector((state)=> state.users)

    async function handleDeleteUser(userId, userName) {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${userName}?`
        );

        if (!confirmed) return;

        try {
            // await adminApi.delete(`/admin/delete-user/${userId}`);

            // setUsersList((prevUsers) =>
            //     prevUsers.filter((user) => user._id !== userId)
            // );

            // alert("User deleted successfully");
            const result = await dispatch(deleteUser(userId)).unwrap();
            dispatch(fetchUsers(currentPage))
            console.log("result from thunk:", result);
            alert("User deleted successfully !");

        } catch (error) {
            console.log(error);
            alert("Failed to delete user");
        }
    }


    useEffect(()=>{
        dispatch(fetchUsers(currentPage));
    }, [dispatch, currentPage]);

    if(loading){
        return(
            <div>Loading users list...</div>
        )
    }

    if(error){
        return (
            <div>
                error fetching users {error}
            </div>
        )
    }

  return (
    <div>
        <h1 className='text-3xl'>admin dashboard</h1>
        <div>
            <button className='bg-red-100 border border-black' onClick={handleLogout}>Logout</button>
        </div>

        <div>
            <Link to="/admin/create-new-user">
                <button className='bg-green-200 border p-1 border-black'>Create new user</button>
            </Link>
        </div>

        <div className='flex flex-col gap-1'>
            {usersList.map((user)=>{
                return(
                    <div key={user._id} className='flex gap-3 p-1 bg-blue-50 hover:bg-blue-200'>
                        <div>
                            <img src={`http://localhost:5000/${user.profileImage}`} alt="" className='aspect-auto object-cover w-32'/>
                        </div>
                        <div className='border'>name: {user.name}</div>
                        <div className='border'>email: {user.email}</div>
                        <Link to={`/admin/edit-user/${user._id}`}>
                            <button className='border bg-yellow-200'>Edit</button>
                        </Link>
                        <button 
                            onClick={()=>handleDeleteUser(user._id, user.name)}
                            className='border bg-red-500'>
                                Delete
                        </button>
                    </div>
                )
            })}
        </div>

        <div>
            <button
                className='bg-grey-200 p-1 border border-black'
                // onClick={() => dispatch(fetchUsers(currentPage - 1))}
                onClick={()=> dispatch(setCurrentPage(currentPage - 1))}
                disabled={currentPage === 1}
                >
                Previous
            </button>

            <span>
                Page {currentPage} of {totalPages}
            </span>

            <button
                className='bg-green-500 p-1 border border-black'
                // onClick={() => dispatch(fetchUsers(currentPage + 1))}
                onClick={()=> dispatch(setCurrentPage(currentPage + 1))}
                disabled={currentPage === totalPages}
                >
                Next
            </button>
        </div>
        
    </div>
  )
}
