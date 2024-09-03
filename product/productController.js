import createError from "http-errors";
import ProductModel from "./productModel.js";
import cloudinary from "cloudinary";
import { getDataUri } from "../utils/features.js";

//GET ALL PRODUCTS
export const getAllProducts = async (req, res, next) => {
  const { keyword, category } = req.query;
  try {
    // Using regular expressions and category filter to find products
    const products = await ProductModel.find({
      name: {
        $regex: keyword ? keyword : "", // If keyword exists, search by regex
        $options: "i",
      },
      category: category ? category : undefined, // Apply category filter if provided
    }).populate("category");

    if (!products || products.length === 0) {
      return next(createError(404, " No products  found "));
    }

    // Sending a successful response with product data
    res.status(200).send({
      status: true,
      message: "All products fetched successfully",
      totalProducts: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching  all products", error.stack || error.message);
    next(createError(500, "Internal server error"));
  }
};

//GET SINGLE PRODUCT
export const getSingleProduct = async (req, res, next) => {
  try {
    // Fetching the product by ID
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return next(createError(404, "Product not  found "));
    }

    // Sending a successful response with the product data
    res.status(200).send({
      status: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error(
      "Error fetching  single product",
      error.stack || error.message
    );
    next(createError(500, "Internal server error"));
  }
};

// CREATE PRODUCT
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category } = req.body;

    if (!name || !description || !price || !stock || !category) {
      return next(createError(400, "Please provide all fields"));
    }

    // Ensure an image file is provided
    if (!req.file) {
      return next(createError(400, "Please provide product images"));
    }

    // Convert file to Data URI format for Cloudinary upload
    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };

    // Creating a new product
    const product = await ProductModel.create({
      name,
      description,
      price,
      category,
      stock,
      images: [image],
    });

    // Sending a successful response with the newly created product data
    res.status(201).send({
      status: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error creating product", error.stack || error.message);
    next(createError(500, "Internal server error"));
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return next(createError(400, "Product Id is required"));
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return next(createError(404, "Product not found"));
    }
    const { name, description, price, stock, category } = req.body;
    // Update product fields if provided in request
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    await product.save(); // Save the updated product

    // Sending a successful response with updated product data
    res.status(200).send({
      status: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error updating product", error.stack || error.message);
    next(createError(500, "Internal server error"));
  }
};

// UPDATE   PRODUCT IMAGE
export const updateImage = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return next(createError(404, "Product not  found "));
    }

    if (!req.file) {
      return next(createError(400, "Please provide product images"));
    }

    // Upload the new image to Cloudinary
    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };

    product.images.push(image);
    await product.save();

    // Sending a successful response with the updated image data
    res.status(200).send({
      status: true,
      message: "Image updated successfully",
      data: {
        imageUrl: image.url,
      },
    });
  } catch (error) {
    console.error("Error updating image", error.stack || error.message);
    next(createError(500, " Internal server error"));
  }
};

// DELETE PRODUCT IMAGE
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

    // Find the image index by image ID
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
    console.error("Error deleting image:", error.stack || error.message);
    next(createError(500, "Internal server error"));
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    if (!productId) {
      return next(createError(400, "Product ID is required"));
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return next(createError(404, "Product not found"));
    }

    // Delete all associated images from Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    // Delete the product from the database
    await product.deleteOne();

    res.status(200).send({
      status: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error.stack || error.message);
    next(createError(500, "Internal server error"));
  }
};

// PRODUCT REVIEW
export const productReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return next(createError(404, "Product not found"));
    }
    console.log(
      "USERID: ",
      product.reviews.find((review) => review)
    );

    // Check if the user has already reviewed the product
    const alreadyReviewed = product.reviews.find(
      (review) => review.userId.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return next(createError(400, "You have already reviewed this product"));
    }

    // Create a new review
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      userId: req.user._id,
    };

    // Add review to product reviews array
    product.reviews.push(review);

    // Update the number of reviews and average rating
    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length; // calculate average rating

    await product.save(); // Save the updated product with the new review
    res.status(201).send({
      status: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    console.error("Error adding product review:", error.stack || error.message);
    next(createError(500, "Internal server error"));
  }
};

// GET TOP PRODUCTS
export const getTopProduct = async (req, res, next) => {
  try {
    // Find the top 3 products sorted by rating in descending order
    const products = await ProductModel.find({}).sort({ rating: -1 }).limit(3);

    res.status(201).send({
      status: true,
      message: "Top products",
      products,
    });
  } catch (error) {
    console.error("Error sorting top products:", error.stack || error.message);
    next(createError(500, "Internal server error"));
  }
};
