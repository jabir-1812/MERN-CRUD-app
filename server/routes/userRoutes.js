import express from "express";
const router = express.Router();


import { loginUser, registerUser, refreshToken, logoutUser } from "../controllers/userController.js";
import { verifyUser } from "../middleware/verifyUser.js";

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post("/refresh-token", refreshToken);
router.post("/logout", logoutUser)

export default router;