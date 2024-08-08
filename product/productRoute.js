import express from "express";
import { getAllProducts } from "./productController";
const router = express.Router();

router.get("/getAllProducts", getAllProducts);

export default productRouter;
