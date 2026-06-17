import jwt from "jsonwebtoken";
import { STATUS_CODES } from "../../shared/statusCodes.js";
import User from "../models/User.js";

export const verifyUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                success: false, 
                message: "No token provided"
            });
        }

        const userAccessToken = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            userAccessToken,
            process.env.JWT_ACCESS_TOKEN_SECRET
        );

        const user = await User.findById(decoded.userId)
        if(user.isDeleted){
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                success: false,
                message: "Account is blocked"
            })
        }

        req.user = decoded;

        next();

    } catch (error) {
        console.log("error in verifyUser() middleware ==> ", error)
        return res.status(STATUS_CODES.UNAUTHORIZED).json({
            success: false,
            message: "Invalid token"
        });
    }
};