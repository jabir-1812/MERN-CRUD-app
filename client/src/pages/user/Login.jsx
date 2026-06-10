import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { setCredentials } from '../../features/auth/authSlice';
import axios from 'axios';
import api from '../../api/axios';

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.user);

    const [formSubmissionError, setFormSubmissionError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();

    async function onSubmit(formData) {
        try {
            setFormSubmissionError("");
            const response = await api.post("/user/login", formData);

            if (!response.data.success) {
                setFormSubmissionError(response.data.message);
                return;
            }

            dispatch(setCredentials({
                accessToken: response.data.accessToken,
                user: response.data.user
            }));

            navigate("/user/home", { replace: true });
        } catch (error) {
            if (error.response) {
                setFormSubmissionError(error.response.data.message);
            } else {
                console.log("error in |Login.jsx|=>", error);
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
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", {
                                        required: "Password is required",
                                    })}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2.5 pr-11 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        // Eye-off icon (password visible → click to hide)
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.477 10.477A3 3 0 0013.5 13.5M6.228 6.228A10.45 10.45 0 003 12c1.657 4.418 6.03 7.5 9 7.5a10.5 10.5 0 004.772-1.228M9.772 4.772A10.5 10.5 0 0112 4.5c3.97 0 7.343 3.082 9 7.5a10.47 10.47 0 01-1.228 2.772" />
                                        </svg>
                                    ) : (
                                        // Eye icon (password hidden → click to show)
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C4.115 7.582 7.857 4.5 12 4.5c4.143 0 7.885 3.082 9.542 7.5-1.657 4.418-5.399 7.5-9.542 7.5-4.143 0-7.885-3.082-9.542-7.5z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
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
    );
}