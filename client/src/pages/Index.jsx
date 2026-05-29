import React from 'react';
import { Link } from 'react-router-dom';

export default function Index() {
  return (
    <div>
        <h1>Index Page</h1>
        <div><Link to="/user/login">Login/register as USER</Link></div>
        <div><Link to="/admin">Login as ADMIN</Link></div>
    </div>
  )
}
