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

router.get('/getTopProduct', getTopProduct)

//GET SINGLE PRODUCT
router.get("/:id", getSingleProduct);


//CREATE PRODUCT
router.post("/createProduct", isAuth, isAdmin, singleUpload, createProduct);

//UPDATE PRODUCT
router.put("/:id", isAuth, isAdmin, updateProduct);

//UPDATE IMAGE
router.put("/image/:id", isAuth, isAdmin, singleUpload, updateImage);

//DELETE IMAGE
router.delete("/:productId/image/:imageId", isAuth, isAdmin, deleteProductImage);

//DELETE
router.delete("/deleteProduct/:productId", isAuth, isAdmin, deleteProduct);

router.put('/:id/review', isAuth, productReview)


export default router;
