import express from "express";
import {
  getUserProfile,
  login,
  logoutUser,
  register,
  updatePassword,
  updateUser,
} from "./userController.js";
import { isAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getUserProfile", isAuth, getUserProfile);
router.get("/logoutUser", isAuth, logoutUser);
router.put("/updateUser", isAuth, updateUser);
router.put('/updatePassword', isAuth, updatePassword)

export default router;
