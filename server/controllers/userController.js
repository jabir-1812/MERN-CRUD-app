import jwt from "jsonwebtoken"
import User from "../models/User.js";
import { STATUS_CODES } from "../../shared/statusCodes.js";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs";

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

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email, 
            password: hashedPassword
        })

        const accessToken = jwt.sign(
            {
                userId: user._id,
                role: "user"
            },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            {
                userId: user._id,
                role: "user"
            },
            process.env.JWT_REFRESH_TOKEN_SECRET,
            {expiresIn: "7d"}
        )

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });


        res.json({
            success: true, 
            message:"User registered successfully", 
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        })
    } catch (error) {
        console.error("error in the registerUser() ===> ", error)
        
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error"
        });
    }
}



export const loginUser = async (req, res)=>{
    try {
        console.log("req.body ==> ", req.body);

        const {email, password} = req.body;
        // console.log("email,,,,",email)

        const user = await User.findOne({email});
        // const allUser = await User.find();
        // console.log("all users ==>", allUser)

        if(!user){
            console.log("no user")
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                success: false,
                message: "User not found"
            });
        }

        const isPasswordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordMatch) {
            console.log("hashed password is not matching")
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                success: false,
                message: "Email or password is wrong"
            });
        }

        

        const accessToken = jwt.sign(
            {
                userId: user._id,
                isAdmin: user.isAdmin
            },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            {expiresIn: "15m"}
        );

        const refreshToken = jwt.sign(
            {
                userId: user._id,
                isAdmin: user.isAdmin
            },
            process.env.JWT_REFRESH_TOKEN_SECRET,
            {expiresIn: "7d"}
        )

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

       res.json({
            success: true,
            accessToken,
            user
        });

    } catch (error) {
        console.error("error in the userLogin() ==> ", error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error"
        });
    }
}


export const refreshToken = async (req, res) => {

    const token = req.cookies.refreshToken;
    // console.log("token oooooo", token)

    if (!token) {
        return res.sendStatus(401);
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_REFRESH_TOKEN_SECRET
        );

        const userData = await User.findById(decoded.userId).select("-password")
        const accessToken = jwt.sign(
            {
                userId: decoded.userId,
                isAdmin: decoded.isAdmin
            },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            {
                expiresIn: "15m"
            }
        );

        // console.log("access token refresh===", decoded)

        res.json({
            accessToken, 
            user: userData
        });

    } catch (error) {

        res.sendStatus(403);
        console.log("error in refreshToken() ==", error)

    }
};



export const logoutUser = async (req, res) => {
    try {

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(STATUS_CODES.OK).json({
            message: "Logged out successfully"
        });

    } catch (error) {
        console.log("error in: logoutUser() ==> ", error);
    }
};



export const editProfile = async (req, res)=>{
    
    try {
        const userId = req.user.userId;

        const { name, email, imageDeleted } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Update basic details
        user.name = name;
        user.email = email;

        // Delete current image if requested
        if (
            imageDeleted === "true" &&
            user.profileImage
        ) {
            const imagePath = path.join(
                process.cwd(),
                user.profileImage
            );

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

            user.profileImage = null;
        }

        // Upload new image
        if (req.file) {

            // Remove old image first
            if (user.profileImage) {
                const oldImagePath = path.join(
                    process.cwd(),
                    user.profileImage
                );

                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            user.profileImage =
                req.file.path.replace(/\\/g, "/");
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
}

