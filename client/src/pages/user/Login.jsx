import React from 'react'
import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div>
        <h1>Login Page</h1>
        <Link to="/user/register">Create new account</Link>
    </div>
  )
}
