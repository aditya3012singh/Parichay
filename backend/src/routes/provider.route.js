import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getProfileController,
  saveProfileController,
  getAllProvidersController,
  getEarningsStatsController,
} from "../controllers/provider.controller.js";

const router = express.Router();

// Get current provider profile
router.get("/", authMiddleware, getProfileController);

// Create/Update provider profile
router.post("/", authMiddleware, saveProfileController);

// ✅ NEW: Get provider earnings dashboard
router.get("/earnings", authMiddleware, getEarningsStatsController);

// Get all providers
router.get("/all", getAllProvidersController);

export default router;
