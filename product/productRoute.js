import express from "express";
import {
  createProduct,
  deleteProduct,
  deleteProductImage,
  getAllProducts,
  getSingleProduct,
  updateImage,
  updateProduct,
} from "./productController.js";
import { isAuth } from "../middleware/authMiddleware.js";
import singleUpload from "../middleware/multer.js";

const router = express.Router();

//GET ALL PRODUCTS
router.get("/getAllProducts", getAllProducts);

//GET SINGLE PRODUCT
router.get("/:id", getSingleProduct);

//CREATE PRODUCT
router.post("/createProduct", isAuth, singleUpload, createProduct);

//UPDATE PRODUCT
router.put("/:id", isAuth, updateProduct);

//UPDATE IMAGE
router.put("/image/:id", isAuth, singleUpload, updateImage);

//DELETE IMAGE
router.delete("/:productId/image/:imageId", isAuth, deleteProductImage);

router.delete("/deleteProduct/:productId", isAuth, deleteProduct);

export default router;
