import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import {
  getCategoriesController,
  createCategoryController,
} from "../controllers/category.controller.js";

const router = express.Router();

// Get all categories
router.get("/", getCategoriesController);

// Create category (admin)
router.post("/", authMiddleware, isAdmin, createCategoryController);

export default router;
