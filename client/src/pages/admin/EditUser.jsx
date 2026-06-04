import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import adminApi from "../../api/adminAxios";
import { useNavigate } from "react-router-dom";

export default function EditUser() {
    const { userId } = useParams();

    const {
        register,
        handleSubmit,
        reset,
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
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("email", data.email);

        if (data.profileImage?.[0]) {
            formData.append("profileImage", data.profileImage[0]);
        }

        formData.append("imageDeleted", imageDeleted);

        try {
            await adminApi.put(`/admin/edit-user/${userId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("User updated");
            navigate('/admin/dashboard')
            
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h2>Edit User</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <input
                        {...register("name", {
                            required: "Name is required",
                        })}
                        placeholder="Name"
                    />
                </div>

                <div>
                    <input
                        {...register("email", {
                            required: "Email is required",
                        })}
                        placeholder="Email"
                    />
                </div>

                {/* Current Profile Image */}
                {profileImage ? (
                    <div>
                        <img
                            src={`http://localhost:5000/${profileImage}`}
                            alt="Profile"
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
                    </div>
                ) : (
                    <div>
                        <label>Upload Profile Image</label>

                        <input
                            type="file"
                            accept="image/*"
                            {...register("profileImage")}
                        />
                    </div>
                )}

                <br />

                <button type="submit">
                    Update User
                </button>
            </form>
        </div>
    );
}
