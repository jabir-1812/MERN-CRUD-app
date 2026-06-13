import express from "express";
const router = express.Router();

import { 
    loginAdmin, 
    refreshToken, 
    logoutAdmin, 
    getUsersList,
    getUserDetails,
    updateUser, 
    createUser,
    deleteUser,
    undeleteUser
} from "../controllers/adminController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import upload from "../middleware/upload.js";


router.post('/login', loginAdmin);
router.post('/refresh-token', refreshToken)
router.post('/logout', logoutAdmin);
router.get("/users-list", verifyAdmin, getUsersList)
router.get("/get-user-details/:userId", verifyAdmin, getUserDetails)
router.put("/edit-user/:userId", verifyAdmin, upload.single("profileImage"), updateUser)
router.post("/create-user", verifyAdmin, upload.single("profileImage"), createUser);
router.delete('/delete-user/:userId', verifyAdmin, deleteUser)
router.patch('/undelete-user/:userId', verifyAdmin, undeleteUser)


export default router;