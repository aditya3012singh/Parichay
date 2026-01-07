import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createBookingController,
  getUserBookingsController,
  getProviderJobsController,
  updateBookingStatusController,
} from "../controllers/booking.controller.js";

const router = express.Router();

// Create booking
router.post("/", authMiddleware, createBookingController);

// Get user's bookings
router.get("/my-bookings", authMiddleware, getUserBookingsController);

// Get provider's jobs
router.get("/my-jobs", authMiddleware, getProviderJobsController);

// Update booking status
router.put("/:bookingId/status", authMiddleware, updateBookingStatusController);

export default router;
