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
        <div>
            <h1>Profile</h1>
            <div>
                {user?.profileImage && <img
                    width="30%"
                    src={`http://localhost:5000/${user.profileImage}`}
                    alt="Profile"
                />}
            </div>
            <div>{user?.name}</div>
            <div>{user?.email}</div>
            <div>
                <button>
                    <Link to="/user/edit-profile">Edit Profile</Link>
                </button>
            </div>
            <div></div>
        </div>
    )
}
