import jwt from "jsonwebtoken"
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

        if(user.password !== password){
            console.log("password wrong")
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                success: false, 
                message: "Email or password is wrong"
            });
        }



        // const token = jwt.sign(
        //     {
        //         id: user._id,
        //         isAdmin: user.isAdmin
        //     }, 
        //     process.env.JWT_ACCESS_TOKEN_SECRET,
        //     {
        //         expiresIn: "15m"
        //     }
        // )

        // res.json({token})
        ///////////////////////////////////////////////

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
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
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
    console.log("token oooooo", token)

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

