import express from "express";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
} from "./productController.js";
import { isAuth } from "../middleware/authMiddleware.js";
import singleUpload from "../middleware/multer.js";

const router = express.Router();

router.get("/getAllProducts", getAllProducts);

router.get("/:id", getSingleProduct);

router.post("/createProduct", isAuth, singleUpload, createProduct);
export default router;
