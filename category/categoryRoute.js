import express from "express";
const router = express.Router();
import { isAdmin, isAuth } from "../middleware/authMiddleware.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "./categoryController.js";

router.post("/createCategory", isAuth, isAdmin, createCategory);

router.get("/getAllCategories", getAllCategories);

router.delete("/deleteCategory/:id", isAuth, isAdmin, deleteCategory);

router.put("/updateCategory/:id", isAuth, isAdmin, updateCategory);

export default router;
