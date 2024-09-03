import express from "express";
const router = express.Router();
import {
  createProduct,
  deleteProduct,
  deleteProductImage,
  getAllProducts,
  getSingleProduct,
  getTopProduct,
  productReview,
  updateImage,
  updateProduct,
} from "./productController.js";
import { isAdmin, isAuth } from "../middleware/authMiddleware.js";
import singleUpload from "../middleware/multer.js";


//GET ALL PRODUCTS
router.get("/getAllProducts", getAllProducts);

// GET TOP PRODUCTS
router.get('/getTopProduct', getTopProduct)

//GET SINGLE PRODUCT
router.get("/:id", getSingleProduct);

//CREATE PRODUCT
// Use singleUpload middleware for handling file upload for creating a product
router.post("/createProduct", isAuth, isAdmin, singleUpload, createProduct);

//UPDATE PRODUCT
router.put("/:id", isAuth, isAdmin, updateProduct);

//UPDATE IMAGE
// Change the route path for clarity and add appropriate middleware
router.put("/image/:id", isAuth, isAdmin, singleUpload, updateImage);

//DELETE IMAGE
// Keep route names consistent and use delete HTTP method for deleting an image
router.delete("/:productId/image/:imageId", isAuth, isAdmin, deleteProductImage);

//DELETE PRODUCT
router.delete("/deleteProduct/:productId", isAuth, isAdmin, deleteProduct);

// ADD REVIEW
router.put('/:id/review', isAuth, productReview)


export default router;
