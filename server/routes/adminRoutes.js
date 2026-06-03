import express from "express";
const router = express.Router();

import { loginAdmin, refreshToken, logoutAdmin } from "../controllers/adminController.js";



router.post('/login', loginAdmin);
router.post('/refresh-token', refreshToken)
router.post('/logout', logoutAdmin);


export default router;