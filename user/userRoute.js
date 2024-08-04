import express from "express";
import { getUserProfile, login, register } from "./userController.js";
import {isAuth} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getUserProfile", isAuth, getUserProfile);

export default router;
