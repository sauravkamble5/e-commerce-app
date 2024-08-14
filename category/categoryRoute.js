import express from "express";
const router = express.Router();
import { isAuth } from "../middleware/authMiddleware.js";
import { createCategory, getAllCategories } from "./categoryController.js";

router.post("/createCategory", isAuth, createCategory);

router.get('/getAllCategories', getAllCategories)

export default router;
