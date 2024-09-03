import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "Category is required"],
      unique: true,
      trim: true,
      minlength: [2, "Category must be at least 2 characters long"],
      maxlength: [50, "Category must be at most 50 characters long"],
    },
  },
  { timestamps: true }
);

const CategoryModel =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);

export default CategoryModel;
