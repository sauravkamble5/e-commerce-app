import createError from "http-errors";
import ProductModel from "./productModel.js";

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
