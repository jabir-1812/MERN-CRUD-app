import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { adminLogout } from "../../features/auth/adminAuthSlice";
import adminApi from "../../api/adminAxios";
import { fetchUsers } from "../../features/adminSide/usersSlice";
import { Link } from "react-router-dom"

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

    const { usersList, loading, error } = useSelector((state)=> state.users)


    useEffect(()=>{
        dispatch(fetchUsers());
    }, [dispatch]);

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
                        <button className='border bg-yellow-200'>Edit</button>
                        <button className='border bg-red-500'>Delete</button>
                    </div>
                )
            })}
        </div>
        
    </div>
  )
}
