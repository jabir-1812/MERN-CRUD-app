import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import adminApi from '../../api/adminAxios';
import { useDispatch, useSelector } from 'react-redux';
import { setAdminCredentials } from '../../features/auth/adminAuthSlice';
import { useNavigate, Link } from 'react-router-dom';


export default function Login() {
    const [formSubmissionError, setFormSubmissionError]= useState("");
    const {register, handleSubmit, formState:{errors}}= useForm();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function onSubmit(formData) {
        try {
            // console.log("form data after submission===>", formData)
            setFormSubmissionError("");

            const response = await adminApi.post(
                "/admin/login",
                formData
            )

            
            console.log("response data====", response.data)
            if(!response.data.success){
                setFormSubmissionError(response.data.message);
                return;
            }
            
            dispatch(
                setAdminCredentials({
                    adminAccessToken: response.data.adminAccessToken,
                    adminData: response.data.adminData
                })
            )

            navigate("/admin/dashboard", {replace : true})
            
        } catch (error) {
            if(error.response){
                console.log("response data ===> ", error.response.data)
                setFormSubmissionError(error.response.data.message);
            }else{
                console.log("error in |admin/Login.jsx|=>", error)
            }    
        }
    }
    
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-8">

            {/* Header */}
            <div className="mb-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin Login</h1>
            <p className="mt-1 text-sm text-gray-400">Restricted access — admins only</p>
            </div>

            {/* Form-level error */}
            {formSubmissionError && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
                {formSubmissionError}
            </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Email field */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                type="email"
                {...register("email", {
                    required: "Email is required",
                    pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                    },
                })}
                placeholder="admin@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-600 bg-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                />
                {errors.email && (
                <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
                )}
            </div>

            {/* Password field */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <input
                type="password"
                {...register("password", {
                    required: "Password is required",
                })}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-600 bg-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                />
                {errors.password && (
                <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>
                )}
            </div>

            {/* Submit button */}
            <button
                type="submit"
                className="w-full mt-2 px-4 py-2.5 rounded-lg bg-yellow-500 text-gray-900 text-sm font-semibold hover:bg-yellow-400 active:scale-[0.98] transition-all duration-150"
            >
                Sign in as Admin
            </button>

            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
                <Link to="/" className="text-indigo-600 font-medium hover:underline">
                Go back
                </Link>
            </p>

        </div>
    </div>
  )
}
