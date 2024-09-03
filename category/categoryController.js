import createError from "http-errors";
import CategoryModel from "./categoryModel.js";
import ProductModel from "../product/productModel.js";

//Create a new category
export const createCategory = async (req, res, next) => {
  try {
    const { category } = req.body;

    if (!category) {
      return next(createError(400, "Category is required"));
    }

    // Check if the category already exists
    const existingCategory = await CategoryModel.findOne({ category });
    if (existingCategory) {
      return next(createError(400, "Category already exists"));
    }

    // Create the new category
    await CategoryModel.create({ category });

    res.status(201).send({
      status: true,
      message: ` ${category} Category created successfully`,
      data: req.body,
    });
  } catch (error) {
    console.error("Error creating category", error);
    next(createError(500, "Internal server error"));
  }
};

//Get all categories
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await CategoryModel.find({});

    res.status(200).send({
      status: true,
      message: "Categories fetched successfully",
      totalCategories: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("Error getting all categories", error);
    next(createError(500, "Internal server error"));
  }
};

//Delete a category
export const deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    if (!categoryId) {
      return next(createError(400, "Category ID is required"));
    }

    // Find the category by ID
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return next(createError(404, "Category not found"));
    }

    const products = await ProductModel.find({ category: category._id });

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = undefined;
      await product.save();
    }
    await category.deleteOne();

    res.status(200).send({
      status: true,
      message: `Category ${categoryId} deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting category", error);
    next(createError(500, "Internal server error"));
  }
};

//update a category
export const updateCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    if (!categoryId) {
      return next(createError(400, "Category ID is required"));
    }

    // Find the category by ID
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return next(createError(404, "Category not found"));
    }
    const { updatedCategory } = req.body;

    // Update the category name
    category.category = updatedCategory;

    await category.save();

    // Find all products associated with the old category
    const products = await ProductModel.find({ category: category._id });

    // Iterate through each product and update its category field
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = updatedCategory; // Set the new category name
      await product.save(); // Save the updated product document
    }

    res.status(200).send({
      status: true,
      message: `Category ${categoryId} updated successfully`,
      data: updatedCategory,
      products,
    });
  } catch (error) {
    console.error("Error updating category", error);
    next(createError(500, "Internal server error"));
  }
};
