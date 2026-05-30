import User from "../models/User.js";
import { STATUS_CODES } from "../../shared/statusCodes.js";

export const registerUser = async (req, res)=>{
    try {
        console.log("req.body====", req.body)
        const {name, email, password, confirmPassword} = req.body;
        
        const userExist = await User.findOne({email});

        if(userExist){
            return res.json({
                success: false,
                message: "User already exists"
            });
        }

        const user = await User.create({
            name,
            email, 
            password
        })

        res.json({success: true, message:"User registered successfully", user})
    } catch (error) {
        console.error("error in the registerUser() ===> ", error)
        
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error"
        });
    }
}

