import createError from "http-errors";
import CategoryModel from "./categoryModel.js";
import ProductModel from "../product/productModel.js";

export const createCategory = async (req, res, next) => {
  try {
    const { category } = req.body;

    if (!category) {
      return next(createError(400, "Category is required"));
    }
    await CategoryModel.create({ category });

    res.status(201).send({
      status: true,
      message: ` ${category} Category created successfully`,
      data: req.body,
    });
  } catch (error) {
    console.error("Error creating category", error.stack || error.message);
    next(createError(500, "Internal server error"));
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await CategoryModel.find({});

    res.status(201).send({
      status: true,

      message: "Categories fetched successfully",
      totalCategories: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("Error getting all categories", error.stack || error.message);
    next(createError(500, "Internal server error"));
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    if (!categoryId) {
      return next(createError(400, "Category ID is required"));
    }
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
    console.error("Error deleting category", error.stack || error.message);
    next(createError(500, "Internal server error"));
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    if (!categoryId) {
      return next(createError(400, "Category ID is required"));
    }

    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return next(createError(404, "Category not found"));
    }
    const { updatedCategory } = req.body;

    category.category = updatedCategory;

    await category.save();

    const products = await ProductModel.find({ category: category._id });

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = updatedCategory;
      await product.save();
    }

    res.status(200).send({
      status: true,
      message: `Category ${categoryId} updated successfully`,
      data: updatedCategory,
      products,
    });
  } catch (error) {
    console.error("Error updating category", error.stack || error.message);
    next(createError(500, "Internal server error"));
  }
};

ProductModel.updateMany()