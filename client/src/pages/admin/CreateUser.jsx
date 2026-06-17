import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import adminApi from "../../api/adminAxios";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../../features/adminSide/usersSlice"
import toast from "react-hot-toast";

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

export default function CreateUser() {
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm();

    const [previewImage, setPreviewImage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const selectedImage = watch("profileImage");

    useEffect(() => {
        if (selectedImage?.[0]) {
            const imageUrl = URL.createObjectURL(selectedImage[0]);
            setPreviewImage(imageUrl);
            return () => URL.revokeObjectURL(imageUrl);
        }
    }, [selectedImage]);

    function handleDeleteImage() {
        setPreviewImage(null);
        setValue("profileImage", null);
    }

    async function onSubmit(data) {
        
        try {
            const formData = new FormData();

            formData.append("name", data.name);
            formData.append("email", data.email);
            formData.append("password", data.password);

            if (data.profileImage?.[0]) {
                formData.append("profileImage", data.profileImage[0]);
            }

            

            const result = await dispatch(addUser(formData)).unwrap();
            console.log("result from the thunk:", result)
            toast.success("User creation succes")
            navigate("/admin/dashboard");


        } catch (error) {
            console.log(error);
            console.log(error?.response.data.message);
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-sm bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-8">

                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">👤</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Create User</h1>
                    <p className="mt-1 text-sm text-gray-400">Fill in the details to add a new user</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Profile Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Profile Image
                        </label>

                        {previewImage ? (
                            <div className="flex flex-col items-center gap-3 p-4 rounded-lg border border-gray-600 bg-gray-700/50">
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-600"
                                />
                                <button
                                    type="button"
                                    onClick={handleDeleteImage}
                                    className="px-4 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/10 active:scale-[0.98] transition-all duration-150"
                                >
                                    Delete Image
                                </button>
                            </div>
                        ) : (
                            <div className="p-4 rounded-lg border border-dashed border-gray-600 bg-gray-700/30">
                                <input
                                    type="file"
                                    accept="image/*"
                                    {...register("profileImage")}
                                    className="w-full text-sm text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border file:border-yellow-500/30 file:text-xs file:font-medium file:text-yellow-400 file:bg-transparent hover:file:bg-yellow-500/10 transition"
                                />
                            </div>
                        )}
                    </div>

                    {/* Name field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            {...register("name", { required: "Name is required" })}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-600 bg-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                        />
                        {errors.name && (
                            <p className="mt-1.5 text-xs text-red-400">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Email field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="user@example.com"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Enter a valid email",
                                },
                            })}
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
                                placeholder="••••••••"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters",
                                    },
                                })}
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
                        Create User
                    </button>

                </form>

                {/* Cancel button */}
                <Link to="/admin/dashboard">
                    <button
                        type="button"
                        className="w-full mt-2 px-4 py-2.5 rounded-lg bg-white/50 text-gray-900 text-sm font-semibold hover:bg-white active:scale-[0.98] transition-all duration-150"
                    >
                        Cancel
                    </button>
                </Link>

            </div>
        </div>
    );
}