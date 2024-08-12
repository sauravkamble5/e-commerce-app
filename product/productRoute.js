import express from "express";
import { getAllProducts, getSingleProduct } from "./productController.js";
const router = express.Router();

router.get("/getAllProducts", getAllProducts);

router.get("/:id", getSingleProduct);
export default router;
