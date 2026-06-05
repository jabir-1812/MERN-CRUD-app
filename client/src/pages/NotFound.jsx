import React from 'react';
import { Link } from 'react-router-dom';

export default function () {
  return (
    <div>
        <h1 className='text-center text-5xl font-bold'>Page Not Found ⚠️</h1>
        <Link to="/" className='text-center font-bold text-3xl'>Go to Index page</Link>
    </div>
  )
}
