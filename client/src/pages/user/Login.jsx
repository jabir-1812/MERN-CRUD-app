import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import api from '../../api/axios';
import { STATUS_CODES } from '../../../../shared/statusCodes';
import {useDispatch, useSelector} from 'react-redux';
import { setCredentials } from '../../features/auth/authSlice';


export default function Login() {
    const dispatch = useDispatch();
    
    const navigate = useNavigate();

    const userData = useSelector((state)=> state.auth.user);

    const [formSubmissionError, setFormSubmissionError]= useState("");
    
    const {register, handleSubmit, formState:{errors}}= useForm();

    async function onSubmit(formData) {
        try {
            // console.log("form data after submission===>", formData)
            setFormSubmissionError("");

            const response = await api.post(
                "/user/login",
                formData
            )

            
            console.log("response data====", response.data)
            if(!response.data.success){
                setFormSubmissionError(response.data.message);
                return;
            }
            
            dispatch(
                setCredentials({
                    accessToken: response.data.accessToken,
                    user: response.data.user
                })
            )

            navigate("/user/home", {replace : true})
            
        } catch (error) {
            console.log(error)
            if(error.response){
                console.log("response data ===> ", error.response)
                console.log("response data ===> ", error.response?.data)
                console.log("response data ===> ", error.response?.data?.message)
                setFormSubmissionError(error.response.data.message);
            }else{
                console.log("error in |Login.jsx|=>", error)
            }    
        }
    }
  return (
    <>
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

            {/* Header */}
            <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back</h1>
            <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>
            </div>

            {/* Form-level error */}
            {formSubmissionError && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                {formSubmissionError}
            </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Email field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                type="email"
                {...register("email", {
                    required: "Email is required",
                    pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                    },
                })}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
                {errors.email && (
                <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
                )}
            </div>

            {/* Password field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                type="password"
                {...register("password", {
                    required: "Password is required",
                })}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
                {errors.password && (
                <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>
                )}
            </div>

            {/* Submit button */}
            <button
                type="submit"
                className="w-full mt-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all duration-150"
            >
                Sign in
            </button>

            </form>

            {/* Register link */}
            <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/user/register" className="text-indigo-600 font-medium hover:underline">
                Create one
            </Link>
            </p>

            <p className="mt-6 text-center text-sm text-gray-500">
            <Link to="/" className="text-indigo-600 font-medium hover:underline">
                Go back
            </Link>
            </p>

        </div>
    </div>
    </>
  )
}
