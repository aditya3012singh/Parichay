import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { findNearbyController } from "../controllers/match.controller.js";

const router = express.Router();

// Find nearby providers
router.post("/nearby", authMiddleware, findNearbyController);

export default router;
