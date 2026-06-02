import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import api from '../../api/axios';
import { STATUS_CODES } from '../../../../shared/statusCodes';
import {useDispatch, useSelector} from 'react-redux';
import { setCredentials } from '../../features/auth/authSlice';


export default function Login() {
    const dispatch = useDispatch();
    const userData = useSelector((state)=> state.auth.user)

    const {register, handleSubmit, formState:{errors}}= useForm();

    async function onSubmit(formData) {
        try {
            console.log("form data after submission===>", formData)

            const response = await api.post(
                "/user/login",
                formData
            )

            
            console.log("response data====", response.data)
            
            dispatch(
                setCredentials({
                    accessToken: response.data.accessToken,
                    user: response.data.user
                })
            )
            
        } catch (error) {
            if(error.response){
                console.log("response data ===> ", error.response.data)
            }else{
                console.log("error in |Login.jsx|=>", error)
            }    
        }
    }
  return (
    <div>
        <h1>Login Page</h1>
        <div>
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
        <Link to="/user/register">Create new account</Link>
    </div>
  )
}
