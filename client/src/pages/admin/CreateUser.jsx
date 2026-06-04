import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import adminApi from "../../api/adminAxios";
import { useNavigate } from "react-router-dom";

export default function CreateUser() {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm();

    const [previewImage, setPreviewImage] = useState(null);

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
                formData.append(
                    "profileImage",
                    data.profileImage[0]
                );
            }

            const response = await adminApi.post(
                "/admin/create-user",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

            console.log(response.data);

            navigate("/admin/dashboard");

        } catch (error) {
            console.log(error);
            console.log(error?.response.data.message);

        }
    }

    return (
        <div>
            <h1>Create User</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Profile Image */}

                <div>
                    {previewImage ? (
                        <>
                            <img
                                src={previewImage}
                                alt="Preview"
                                width="150"
                            />

                            <div>
                                <button
                                    type="button"
                                    onClick={handleDeleteImage}
                                >
                                    Delete Image
                                </button>
                            </div>
                        </>
                    ) : (
                        <input
                            type="file"
                            accept="image/*"
                            {...register("profileImage")}
                        />
                    )}
                </div>

                <br />

                {/* Name */}

                <div>
                    <input
                        type="text"
                        placeholder="Name"
                        {...register("name", {
                            required:
                                "Name is required",
                        })}
                    />

                    {errors.name && (
                        <p>{errors.name.message}</p>
                    )}
                </div>

                <br />

                {/* Email */}

                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        {...register("email", {
                            required:
                                "Email is required",
                            pattern: {
                                value:
                                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message:
                                    "Enter a valid email",
                            },
                        })}
                    />

                    {errors.email && (
                        <p>{errors.email.message}</p>
                    )}
                </div>

                <br />

                {/* Password */}

                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        {...register("password", {
                            required:
                                "Password is required",
                            minLength: {
                                value: 6,
                                message:
                                    "Password must be at least 6 characters",
                            },
                        })}
                    />

                    {errors.password && (
                        <p>{errors.password.message}</p>
                    )}
                </div>

                <br />

                <button type="submit">
                    Create User
                </button>
            </form>
        </div>
    );
}