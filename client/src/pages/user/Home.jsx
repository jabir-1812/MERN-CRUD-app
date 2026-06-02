import React from 'react';
import { useSelector } from 'react-redux';

export default function Home() {

    const {user, loading} = useSelector((state)=> state.auth)
    console.log("user==", user)
    console.log("loding==", loading)

    if(loading){
        return (
            <h2>Loading...</h2>
        )
    }
  return (
    <div>
        <h1>User Home page</h1>
        <h2>Welcome 🎉{user?.name}</h2>
    </div>
  )
}
