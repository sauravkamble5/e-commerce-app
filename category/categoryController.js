import createError from "http-errors";
import CategoryModel from "./categoryModel.js";

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
