import express from "express";
const router = express.Router();

import { isAdmin, isAuth } from "../middleware/authMiddleware.js";
import {
  adminGetAllOrders,
  createOrder,
  getAllOrders,
  getSingleOrder,
  payment,
  updateOrderStatus,
} from "./orderController.js";

router.post("/createOrder", isAuth, createOrder);

router.get("/getAllOrders", isAuth, getAllOrders);

router.get("/getSingleOrder/:id", isAuth, getSingleOrder);

router.post("/payment", isAuth, payment);

router.get("/admin/adminGetAllOrders", isAuth, isAdmin, adminGetAllOrders);

router.put("/admin/order/:id", isAuth, isAdmin, updateOrderStatus);
export default router;
