import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import adminApi from "../../api/adminAxios";
import { useNavigate, Link } from "react-router-dom";
import {useDispatch} from "react-redux";
import {updateUser} from '../../features/adminSide/usersSlice'

export default function EditUser() {
    const { userId } = useParams();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        reset,
        formState:{errors}
    } = useForm();

    const [profileImage, setProfileImage] = useState(null);
    const [imageDeleted, setImageDeleted] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
    }, []);

    async function fetchUser() {
        try {
            const response = await adminApi.get(`/admin/get-user-details/${userId}`);

            const user = response.data.user;
            console.log("user data", user)

            reset({
                name: user.name,
                email: user.email,
            });

            setProfileImage(user.profileImage);
        } catch (error) {
            console.log(error);
        }
    }

    function handleDeleteImage() {
        setProfileImage(null);
        setImageDeleted(true);
    }

    async function onSubmit(data) {
        console.log("data ==", data)
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("email", data.email);

        if (data.profileImage?.[0]) {
            formData.append("profileImage", data.profileImage[0]);
        }

        formData.append("imageDeleted", imageDeleted);

        
        console.log("edit user ==>", [...formData.entries()])
        try {
            const result = await dispatch(updateUser({formData, userId})).unwrap();
            console.log("result form the thunk:", result)
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
                    <span className="text-2xl">✏️</span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Edit User</h2>
                <p className="mt-1 text-sm text-gray-400">Update the user's details below</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Name field */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                    <input
                    {...register("name", {
                        required: "Name is required",
                    })}
                    placeholder="John Doe"
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
                    {...register("email", {
                        required: "Email is required",
                    })}
                    placeholder="user@example.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-600 bg-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                    />
                    {errors.email && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
                    )}
                </div>

                {/* Profile Image Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                    Profile Image
                    </label>

                    {profileImage ? (
                    <div className="flex flex-col items-center gap-3 p-4 rounded-lg border border-gray-600 bg-gray-700/50">
                        <img
                        src={`http://localhost:5000/${profileImage}`}
                        alt="Profile"
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

                {/* Submit button */}
                <button
                    type="submit"
                    className="w-full mt-2 px-4 py-2.5 rounded-lg bg-yellow-500 text-gray-900 text-sm font-semibold hover:bg-yellow-400 active:scale-[0.98] transition-all duration-150"
                >
                    Update User
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
