import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createBookingController,
  getUserBookingsController,
  getUserBookingsByStatusController,
  getProviderJobsController,
  getProviderJobsByStatusController,
  getProviderEarningsController,
  updateBookingStatusController,
} from "../controllers/booking.controller.js";

const router = express.Router();

// Create booking
router.post("/", authMiddleware, createBookingController);

// Get user's bookings
router.get("/my-bookings", authMiddleware, getUserBookingsController);

// ✅ NEW: Get user bookings by status
router.get("/my-bookings/:status", authMiddleware, getUserBookingsByStatusController);

// Get provider's jobs
router.get("/my-jobs", authMiddleware, getProviderJobsController);

// ✅ NEW: Get provider jobs by status
router.get("/my-jobs/:status", authMiddleware, getProviderJobsByStatusController);

// ✅ NEW: Get provider earnings dashboard
router.get("/my-earnings", authMiddleware, getProviderEarningsController);

// Update booking status
router.put("/:bookingId/status", authMiddleware, updateBookingStatusController);

export default router;
