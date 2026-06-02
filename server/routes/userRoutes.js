import express from "express";
const router = express.Router();


import { loginUser, registerUser, refreshToken } from "../controllers/userController.js";

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post("/refresh-token", refreshToken);

export default router;