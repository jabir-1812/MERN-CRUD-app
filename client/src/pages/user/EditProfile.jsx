import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../api/axios';
import { updateUser } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
    const userData = useSelector((state)=> state.auth.user);
    const {register, handleSubmit, formState: {errors}} = useForm({
        defaultValues:{
            name: userData?.name,
            email: userData?.email
        }
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function onSubmit(data) {
        console.log("form data after submission===", data)
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("email", data.email);

        if (data.profileImage[0]) {
            formData.append("profileImage", data.profileImage[0]);
        }

        try {
            const response = await api.put(
                "/user/edit-profile",
                formData
            );

            console.log(response.data);

            dispatch(
                updateUser(response.data)
            );

            navigate('/user/profile');

        } catch (error) {
            console.log(error);
        }
    }
  return (
    <div>
        <h1>Edit profile</h1>
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <input
                        type="file"
                        accept="image/*"
                        {...register("profileImage")}
                    />
                </div>
                <div>
                    <input {...register("name", {required: true})} placeholder="Name"/>
                    {errors.name && <p>Name is required</p>}
                </div>
                <div>
                    <input type="email" 
                    {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Enter a valid email address",
                            }
                        }
                    )} 
                    placeholder="Email"/>
                    {errors.email && <p>{errors.email.message}</p>}
                </div>
                
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    </div>
  )
}
