import { STATUS_CODES } from "../../shared/statusCodes.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";





export const loginAdmin = async (req, res)=> {
    try {
        console.log("req.body ==> ", req.body)

        const { email, password } = req.body;

        const adminData = await User.findOne({email});

        if(!adminData){
            console.log("no admin found");
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                success: false,
                message: "Admin not found"
            });
        }

        if(!adminData.isAdmin){
            console.log("client is not an admin");
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                success: false,
                message: "You are not an admin"
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, adminData.password)

        if(!isPasswordMatch){
            console.log("hashed password is not matching");
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                success: false,
                message: "Email or password is wrong"
            })
        }

         const adminAccessToken = jwt.sign(
            {
                adminId: adminData._id,
                isAdmin: adminData.isAdmin
            },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            {expiresIn: "15m"}
        );

        const adminRefreshToken = jwt.sign(
            {
                adminId: adminData._id,
                isAdmin: adminData.isAdmin
            },
            process.env.JWT_REFRESH_TOKEN_SECRET,
            {expiresIn: "7d"}
        )

        res.cookie("adminRefreshToken", adminRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.json({
            success: true,
            adminAccessToken,
            adminData: {
                id: adminData._id,
                name: adminData.name,
                email: adminData.email,
                isAdmin: adminData.isAdmin
            }
        });
    } catch (error) {
        console.log("error in loginAdmin() ==> ", error)
    }
}