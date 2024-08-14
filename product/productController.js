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

export const createProduct = async (req, res, next) => {
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

export const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return next(createError(400, "Product Id is required"));
    }
    const product = await ProductModel.findById(productId);
    if (!product) {
      return next(createError(404, "product not found"));
    }
    const { name, description, price, stock, category } = req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    await product.save();
    res.status(200).send({
      status: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error updating product", error);
    console.error(error.stack);
    next(createError(500, "Internal server error"));
  }
};

export const updateImage = async (req, res, next) => {
  try {
    res.status(200).send({
      status: true,
      message: "Image updated successfully",
      data: {
        imageUrl: image.url,
      },
    });
  } catch (error) {
    console.error("Internal server error", error);
    console.error(error.stack);
    next(createError(500, "Error updating image"));
  }
};

export const deleteProductImage = async (req, res, next) => {
  try {
    const { productId, imageId } = req.params;

    if (!productId || !imageId) {
      return next(createError(400, "Product ID & Image ID are required"));
    }

    //Find the product by ID
    const product = await ProductModel.findById(productId);
    if (!product) {
      return next(createError(404, "Product not found"));
    }

    //Find the image by ID
    const imageIndex = product.images.findIndex(
      (image) => image._id.toString() === imageId
    );

    if (imageIndex === -1) {
      return next(createError(404, "Image not found"));
    }

    //Delete the image from cloudinary
    const imageToDelete = product.images[imageIndex];
    await cloudinary.v2.uploader.destroy(imageToDelete.public_id);

    //Remove the image from the product's image array
    product.images.splice(imageIndex, 1);

    //Save the updated product
    await product.save();

    res.status(200).send({
      status: true,
      message: "Image deleted successfully",
      data: {
        imageUrl: imageToDelete.url,
      },
    });
  } catch (error) {
    console.error("Internal server error", error);
    console.error(error.stack);
    next(createError(500, "Error deleting image"));
  }
};

export const deleteProduct = async (req, res,next) => {
  try {
    const productId = req.params.productId;
    if (!productId) {
      return next(createError(400, "Product ID is required"));
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return next(createError(404, "Product not found"));
    }

    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    await product.deleteOne();

    res.status(200).send({
      status: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Internal server error");
    console.error(error.stack);
    next(createError(500, "Error deleting product"));
  }
};
