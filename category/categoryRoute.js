import express from "express";
const router = express.Router();
import { isAdmin, isAuth } from "../middleware/authMiddleware.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "./categoryController.js";

//CREATE CATEGORY
router.post("/createCategory", isAuth, isAdmin, createCategory);

//GET ALL CATEGORIES
router.get("/getAllCategories", getAllCategories);

//DELETE CATEGORY
router.delete("/deleteCategory/:id", isAuth, isAdmin, deleteCategory);

//UPDATE CATEGORY
router.put("/updateCategory/:id", isAuth, isAdmin, updateCategory);

export default router;
