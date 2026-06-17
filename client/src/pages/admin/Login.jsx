import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import adminApi from '../../api/adminAxios';
import { useDispatch, useSelector } from 'react-redux';
import { setAdminCredentials } from '../../features/auth/adminAuthSlice';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C4.115 7.582 7.857 4.5 12 4.5c4.143 0 7.885 3.082 9.542 7.5-1.657 4.418-5.399 7.5-9.542 7.5-4.143 0-7.885-3.082-9.542-7.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.477 10.477A3 3 0 0013.5 13.5M6.228 6.228A10.45 10.45 0 003 12c1.657 4.418 6.03 7.5 9 7.5a10.5 10.5 0 004.772-1.228M9.772 4.772A10.5 10.5 0 0112 4.5c3.97 0 7.343 3.082 9 7.5a10.47 10.47 0 01-1.228 2.772" />
    </svg>
);

export default function Login() {
    const [formSubmissionError, setFormSubmissionError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function onSubmit(formData) {
        try {
            setFormSubmissionError("");

            const response = await adminApi.post("/admin/login", formData);

            if (!response.data.success) {
                setFormSubmissionError(response.data.message);
                return;
            }

            dispatch(setAdminCredentials({
                adminAccessToken: response.data.adminAccessToken,
                adminData: response.data.adminData
            }));
            

            toast.success("Login success")

            navigate("/admin/dashboard", { replace: true });

        } catch (error) {
            if (error.response) {
                setFormSubmissionError(error.response.data.message);
                toast.error(error.response.data.message)
            } else {
                console.log("error in |admin/Login.jsx|=>", error);
                toast.error("internal error: ", error)
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
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password", {
                                    required: "Password is required",
                                })}
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 pr-11 rounded-lg border border-gray-600 bg-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-300 transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
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
    );
}