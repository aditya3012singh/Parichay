import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createReviewController,
  getProviderReviewsController,
  getAverageRatingController,
} from "../controllers/review.controller.js";

const router = express.Router();

// Create review
router.post("/", authMiddleware, createReviewController);

// Get provider reviews
router.get("/provider/:providerId", getProviderReviewsController);

// Get average rating
router.get("/provider/:providerId/average", getAverageRatingController);

export default router;