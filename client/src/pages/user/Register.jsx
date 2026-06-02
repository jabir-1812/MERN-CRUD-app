import { useState } from "react";
import { Link } from "react-router-dom";
import {useForm} from "react-hook-form";
import axios from "axios";
import api from "../../api/axios";
import { STATUS_CODES } from "../../../../shared/statusCodes";


export default function Register(){
    const {register, handleSubmit, watch, formState:{errors}} = useForm();

    const password = watch("password");

    const [formSubmissionError, setFormSubmissionError]= useState("");

    async function onSubmit(formData){
        try {
            // console.log("form data after submission===", formData)
            setFormSubmissionError("");

            const response = await api.post(
                "/user/register",
                formData
            )

            console.log("response data====>", response.data)  
            console.log("response object====>", response)  

            if(!response.data.success){
                setFormSubmissionError(response.data.message);
                return;
            }
        } catch (error) {
            console.log("error in |Register.jsx|=>", error)
        }
    }
    return(
        <>
            <div>{formSubmissionError && formSubmissionError}</div>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                    <input type="password" 
                        {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            }
                        )} 
                        placeholder="Password"/>
                    {errors.password && <p>{errors.password.message}</p>}
                </div>
                <div>
                    <input type="password" 
                        {...register("confirmPassword", {
                            required: "Please confirm your password",
                            validate: (value)=>
                                value === password || "Passwords do not match",
                            }
                        )} 
                        placeholder="Confirm Password"/>
                    {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
                </div>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
            <div>
                <Link to="/user/login">Login as user</Link>
            </div>
        </>
        
    )
}

