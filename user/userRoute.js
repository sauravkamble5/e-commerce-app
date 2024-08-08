import express from "express";
import {
  getUserProfile,
  login,
  logoutUser,
  register,
  updatePassword,
  updatePicture,
  updateUser,
} from "./userController.js";
import { isAuth } from "../middleware/authMiddleware.js";
import singleUpload from "../middleware/multer.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getUserProfile", isAuth, getUserProfile);
router.get("/logoutUser", isAuth, logoutUser);
router.put("/updateUser", isAuth, updateUser);
router.put("/updatePassword", isAuth, updatePassword);
router.put("/updatePicture", isAuth, singleUpload, updatePicture);

export default router;
