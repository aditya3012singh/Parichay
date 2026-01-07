import {
  getAllCategories,
  createCategory,
} from "../services/category.service.js";

// Get all categories
export const getCategoriesController = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.status(200).json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Create category (admin)
export const createCategoryController = async (req, res) => {
  try {
    const category = await createCategory(req.body);
    res.status(201).json({ category });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
