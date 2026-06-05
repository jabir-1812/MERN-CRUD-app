import React from 'react';
import { Link } from 'react-router-dom';

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">

            <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome</h1>
            <p className="mt-2 text-sm text-gray-500">Choose how you'd like to continue</p>
            </div>

            <div className="space-y-3">
            <Link
                to="/user/login"
                className="flex items-center justify-between w-full px-5 py-3.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 active:scale-[0.98] transition-all duration-150"
            >
                <span>Login as User</span>
                <span className="text-indigo-200 text-lg">→</span>
            </Link>

            <Link
                to="/user/register"
                className="flex items-center justify-between w-full px-5 py-3.5 rounded-xl border border-indigo-200 text-indigo-700 font-medium hover:bg-indigo-50 active:scale-[0.98] transition-all duration-150"
            >
                <span>Register as User</span>
                <span className="text-indigo-400 text-lg">→</span>
            </Link>

            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
                </div>
                <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-gray-400 uppercase tracking-widest">Admin</span>
                </div>
            </div>

            <Link
                to="/admin/login"
                className="flex items-center justify-between w-full px-5 py-3.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 active:scale-[0.98] transition-all duration-150"
            >
                <span>Login as Admin</span>
                <span className="text-gray-400 text-lg">→</span>
            </Link>
            </div>

        </div>
    </div>
  )
}
