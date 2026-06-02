import React from 'react';
import { useSelector } from 'react-redux';

export default function Home() {

    const userName = useSelector((state)=> state.auth.user)
    console.log("username==", userName)
  return (
    <div>
        <h1>User Home page</h1>
        <h2>Welcome 🎉{userName.name}</h2>
    </div>
  )
}
