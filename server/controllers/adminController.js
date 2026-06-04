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
                role: "admin"
            },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            {expiresIn: "15m"}
        );

        const adminRefreshToken = jwt.sign(
            {
                adminId: adminData._id,
                role: "admin"
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



export const refreshToken = async (req, res) => {

    const token = req.cookies.adminRefreshToken;
    console.log("admin token oooooo", token)

    if (!token) {
        return res.sendStatus(401);
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_REFRESH_TOKEN_SECRET
        );

        const adminData = await User.findById(decoded.adminId).select("-password")
        const adminAccessToken = jwt.sign(
            {
                adminId: decoded.adminId,
                isAdmin: decoded.isAdmin
            },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            {
                expiresIn: "15m"
            }
        );

        // console.log("access token refresh===", decoded)

        res.json({
            adminAccessToken, 
            adminData
        });

    } catch (error) {

        res.sendStatus(403);
        console.log("error in refreshToken() ==", error)

    }
};



export const logoutAdmin = async (req, res)=>{
    try {
        res.clearCookie("adminRefreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        })

        return res.status(STATUS_CODES.OK).json({
            message: "admin logged out successfully"
        });
    } catch (error) {
        console.log("error in: logoutAdmin() ==> ", error)
    }
}



export const getUsersList = async (req, res)=>{
    try {
        const usersList = await User.find({isAdmin: false}).select("-password");

        res.status(STATUS_CODES.OK).json({usersList, success: true})
    } catch (error) {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Inernal error in fetching users list"
        })

        console.log("error in getUserList() ==> ", error);
    }
}