import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../api/axios';
import { updateUser } from '../../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function EditProfile() {
    const userData = useSelector((state) => state.auth.user);
    console.log("userData==", userData)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: userData?.name || "",
            email: userData?.email || ""
        }
    });

    const [profileImage, setProfileImage] = useState(
        userData?.profileImage || null
    );

    const [imageDeleted, setImageDeleted] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleDeleteImage() {
        setProfileImage(null);
        setImageDeleted(true);
    }

    const newProfileImage = watch("profileImage")
    const [previewNewProfileImage, setPreviewNewProfileImage] = useState(null)
    
    useEffect(()=>{
        if(newProfileImage?.[0]){
            const imageUrl = URL.createObjectURL(newProfileImage[0]);
            setPreviewNewProfileImage(imageUrl);
            return()=> URL.revokeObjectURL(imageUrl)
        }
    },[newProfileImage])

    async function onSubmit(data) {
        try {
            const formData = new FormData();

            formData.append("name", data.name);
            formData.append("email", data.email);
            formData.append("imageDeleted", imageDeleted);

            if (data.profileImage?.[0]) {
                formData.append(
                    "profileImage",
                    data.profileImage[0]
                );
            }

            const response = await api.put(
                "/user/edit-profile",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            dispatch(
                updateUser(response.data.user)
            );

            navigate("/user/profile");

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

                {/* Header */}
                <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Profile</h1>
                <p className="mt-1 text-sm text-gray-500">Update your personal details</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Profile Image Section */}
                <div className="flex flex-col items-center gap-3 mb-2">
                    {profileImage ? (
                    <>
                        <img
                        src={`http://localhost:5000/${profileImage}`}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100 shadow-sm"
                        />
                        <button
                        type="button"
                        onClick={handleDeleteImage}
                        className="px-4 py-1.5 rounded-lg border border-red-200 text-red-500 text-xs font-medium hover:bg-red-50 active:scale-[0.98] transition-all duration-150"
                        >
                        Delete Image
                        </button>
                    </>
                    ) : (
                        previewNewProfileImage ?
                        (
                            <div className="flex flex-col items-center gap-3 p-4 rounded-lg ">
                                <img
                                    src={previewNewProfileImage}
                                    alt="Preview"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100 shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={()=>{setPreviewNewProfileImage(null)}}
                                    className="px-4 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/10 active:scale-[0.98] transition-all duration-150"
                                >
                                    Delete Image
                                </button>
                            </div>
                        )
                        :
                        (
                            <div className="w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                Profile Image
                                </label>
                                <input
                                type="file"
                                accept="image/*"
                                {...register("profileImage")}
                                className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border file:border-indigo-200 file:text-xs file:font-medium file:text-indigo-600 file:bg-white hover:file:bg-indigo-50 transition"
                                />
                            </div>
                        )
                    
                    )}
                </div>

                {/* Name field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                    {...register("name", {
                        required: "Name is required",
                    })}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                    {errors.name && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>
                    )}
                </div>

                {/* Email field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                    type="email"
                    placeholder="you@example.com"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                        },
                    })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                    {errors.email && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
                    )}
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    className="w-full mt-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all duration-150"
                >
                    Update Profile
                </button>

                {/* Cancel button */}
                <Link to="/user/profile">
                <button
                    type="submit"
                    className="w-full mt-2 px-4 py-2.5 rounded-lg bg-yellow-200 text-gray-500 text-sm font-semibold hover:bg-yellow-300 active:scale-[0.98] transition-all duration-150"
                >
                    Cancel
                </button>
                </Link>

                </form>
            </div>
        </div>
    );
}
