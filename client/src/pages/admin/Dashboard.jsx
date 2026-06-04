import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import adminApi from '../../api/adminAxios';
import { adminLogout } from '../../features/auth/adminAuthSlice';

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
        async function fetchUsersList() {
            try {
                const response = await adminApi.get("/admin/users-list");
                console.log("response data users list", response.data)
                setUsersList(response.data.usersList)
            } catch (error) {
                console.log("error in fetchUsersList() ==> ", error)
            }
        }

        fetchUsersList();
    },[]);

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
            <button>Create user</button>
        </div>
        {usersList.map((user)=>{
            return(
                <div key={user._id}>
                    <div>name: {user.name}</div>
                    <div>email: {user.email}</div>
                    <div>
                        <button>edit</button>
                        <button>delete</button>
                    </div>
                    <hr />
                </div>
            )
        })}
    </div>
  )
}
