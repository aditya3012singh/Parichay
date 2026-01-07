import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import {
  getCouponsController,
  createCouponController,
} from "../controllers/coupon.controller.js";

const router = express.Router();

// Get all active coupons
router.get("/", authMiddleware, getCouponsController);

// Create coupon (admin)
router.post("/", authMiddleware, isAdmin, createCouponController);

export default router;