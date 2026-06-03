import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import api from '../../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAdminCredentials } from '../../features/auth/adminAuthSlice';
import { useNavigate } from 'react-router-dom';


export default function Login() {
    const [formSubmissionError, setFormSubmissionError]= useState("");
    const {register, handleSubmit, formState:{errors}}= useForm();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function onSubmit(formData) {
        try {
            // console.log("form data after submission===>", formData)
            setFormSubmissionError("");

            const response = await api.post(
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
    <div>
        <h1>Admin Login</h1>
        <div>{formSubmissionError && formSubmissionError}</div>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                    placeholder='Email' />
                    {errors.email && <p>{errors.email.message}</p>}
            </div>
            <div>
                <input type="password" 
                    {...register("password", {
                            required: "Password is required",
                        }
                    )} 
                    placeholder="Password"/>
                {errors.password && <p>{errors.password.message}</p>} 
            </div>
            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
    </div>
  )
}
