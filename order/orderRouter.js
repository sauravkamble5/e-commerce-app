import express from "express";
const router = express.Router();

import { isAuth } from "../middleware/authMiddleware.js";
import {
  createOrder,
  getAllOrders,
  getSingleOrder,
  payment,
} from "./orderController.js";

router.post("/createOrder", isAuth, createOrder);

router.get("/getAllOrders", isAuth, getAllOrders);

router.get("/getSingleOrder/:id", isAuth, getSingleOrder);

router.post("/payment", isAuth, payment);

export default router;
