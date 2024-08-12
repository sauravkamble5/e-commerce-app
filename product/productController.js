import createError from "http-errors";
import ProductModel from "./productModel.js";
import cloudinary from "cloudinary";
import { getDataUri } from "../utils/features.js";

//GET ALL PRODUCTS
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await ProductModel.find({});

    if (!products || products.length === 0) {
      return next(createError(404, " No products  found "));
    }

    res.status(200).send({
      status: true,
      message: "All products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching  all products", error.message);
    console.error(error.stack);
    next(createError(500, "Internal server error"));
  }
};

//GET SINGLE PRODUCT
export const getSingleProduct = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return next(createError(404, "  product not  found "));
    }

    res.status(200).send({
      status: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error fetching  single product", error.message);
    console.error(error.stack);
    next(createError(500, "Internal server error"));
  }
};

export const createProduct = async (req, res,next) => {
  try {
    const { name, description, price, stock, category } = req.body;
    // if (!name || !description || !price || !stock || !category) {
    //   return next(createError(400, "Please provide all fields"));
    // }

   if (!req.file) {
      return next(createError(400, "Please provide product images"));
    }

    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
 
    const product = await ProductModel.create({
      name,
      description,
      price,
      category,
      stock,
      images: [image],
    });

    res.status(201).send({
      status: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error creating product");
    console.error(error.stack);
    next(createError(500, "Internal server error"));
  }
};
