import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getNotificationsController,
  markAsReadController,
} from "../controllers/notification.controller.js";

const router = express.Router();

// Get notifications
router.get("/", authMiddleware, getNotificationsController);

// Mark as read
router.put("/:id/read", authMiddleware, markAsReadController);

export default router;