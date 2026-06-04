import express from "express";
const router = express.Router();
import upload from "../middleware/upload.js";


import { 
    loginUser, 
    registerUser, 
    refreshToken, 
    logoutUser, 
    editProfile 
} from "../controllers/userController.js";

import { verifyUser } from "../middleware/verifyUser.js";

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post("/refresh-token", refreshToken);
router.post("/logout", logoutUser)
router.put("/edit-profile", verifyUser, upload.single("profileImage"), editProfile)

export default router;