import express from "express";
const router = express.Router();

import { loginAdmin, refreshToken, logoutAdmin, getUsersList } from "../controllers/adminController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";


router.post('/login', loginAdmin);
router.post('/refresh-token', refreshToken)
router.post('/logout', logoutAdmin);
router.get("/users-list", verifyAdmin, getUsersList)


export default router;