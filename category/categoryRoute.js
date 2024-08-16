import express from "express";
const router = express.Router();
import { isAuth } from "../middleware/authMiddleware.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "./categoryController.js";

router.post("/createCategory", isAuth, createCategory);

router.get("/getAllCategories", getAllCategories);

router.delete("/deleteCategory/:id", isAuth, deleteCategory);

router.put("/updateCategory/:id", isAuth, updateCategory);

export default router;
