import express from "express";
const router = express.Router();

import {
  getUserProfile,
  login,
  logoutUser,
  register,
  resetPassword,
  updatePassword,
  updatePicture,
  updateUser,
} from "./userController.js";
import { isAuth } from "../middleware/authMiddleware.js";
import singleUpload from "../middleware/multer.js";

router.post("/register", register); // Register a new user
router.post("/login", login);       // User login
router.get("/getUserProfile", isAuth, getUserProfile); // Fetch user profile
router.get("/logoutUser", isAuth, logoutUser);         // User logout
router.put("/updateUser", isAuth, updateUser);         // Update user details
router.put("/updatePassword", isAuth, updatePassword); // Update password 
router.put("/updatePicture", isAuth, singleUpload, updatePicture);  // Update profile picture
router.post("/resetPassword", resetPassword); // Reset password

export default router;
