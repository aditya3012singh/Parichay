import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createSlotController,
  getSlotsController,
  deleteSlotController,
} from "../controllers/availability.controller.js";

const router = express.Router();

// Create slot
router.post("/", authMiddleware, createSlotController);

// Get slots
router.get("/", authMiddleware, getSlotsController);

// Delete slot
router.delete("/:slotId", authMiddleware, deleteSlotController);

export default router;
