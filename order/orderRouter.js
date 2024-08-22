import express from "express";
const router = express.Router();

import { isAuth } from "../middleware/authMiddleware.js";
import { createOrder } from "./orderController.js";

router.post("/createOrder", isAuth, createOrder);

export default router;
