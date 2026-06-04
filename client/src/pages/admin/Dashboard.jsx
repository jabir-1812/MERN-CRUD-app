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

    useEffect(()=>{
        if(!adminData) return;
        async function fetchUsersList() {
            try {
                const response = await adminApi.get("/admin/users-list");
                console.log("response data users list", response.data)
                setUsersList(response.data.usersList)
            } catch (error) {
                console.log("error in fetchUsersList() ==> ", error)
                console.log("status:", error.response?.status);
                console.log("data:", error.response?.data);
            }
        }

        fetchUsersList();
    },[adminData]);

    if(adminDashboardLoading){
        return(
            <h2>Admin Dashboard is loading...</h2>
        )
    }

  return (
    <div>
        <h1>Admin Dashboard</h1>
        <h1>Welcome 🎉 {adminData?.name}</h1>
        <div><button onClick={handleLogout}>Logout</button></div>
        <div>
            <Link to="/admin/create-new-user">
                <button>Create a new user</button>
            </Link>
        </div>
        {usersList.map((user)=>{
            return(
                <div key={user._id}>
                    {user?.profileImage && (
                        <div>
                            <img  
                                width="30%"
                                src={`http://localhost:5000/${user.profileImage}`}
                                alt="Profile"
                            />
                        </div>
                    )}
                    <div>name: {user.name}</div>
                    <div>email: {user.email}</div>
                    <div>
                        <Link to={`/admin/edit-user/${user._id}`}>
                            <button>Edit</button>
                        </Link>
                        <button>delete</button>
                    </div>
                    <hr />
                </div>
            )
        })}
    </div>
  )
}
