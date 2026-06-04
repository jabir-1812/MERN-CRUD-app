import jwt from "jsonwebtoken";
import { STATUS_CODES } from "../../shared/statusCodes";

export const verifyAdmin = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                success: false, 
                message: "No token provided"
            });
        }

        const adminAccessToken = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            adminAccessToken,
            process.env.JWT_ACCESS_TOKEN_SECRET
        );

        if (decoded.role !== "admin") {
            return res.status(STATUS_CODES.FORBIDDEN).json({
                success: false,
                message: "Admin access only"
            });
        }

        req.admin = decoded;

        next();

    } catch (error) {
        console.log("error in verifyAdmin() middleware ==> ", error)
        return res.status(STATUS_CODES.UNAUTHORIZED).json({
            success: false,
            message: "Invalid token"
        });
    }
};