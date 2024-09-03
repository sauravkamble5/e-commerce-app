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

//CREATE AN ORDER
router.post("/createOrder", isAuth, createOrder);

//GET ALL ORDERS
router.get("/getAllOrders", isAuth, getAllOrders);

//GET A SINGLE ORDER
router.get("/getSingleOrder/:id", isAuth, getSingleOrder);

//PAYMENT PROCESS (AUTHENTICATED USERS ONLY)
router.post("/payment", isAuth, payment);

//GET ALL ORDERS (ADMINS ONLY)
router.get("/admin/adminGetAllOrders", isAuth, isAdmin, adminGetAllOrders);

//UPDATE THE STATUS OF AN ORDER (ADMINS ONLY)
router.put("/admin/order/:id", isAuth, isAdmin, updateOrderStatus);
export default router;
