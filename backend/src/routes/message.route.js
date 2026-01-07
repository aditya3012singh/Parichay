import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getConversationController,
  sendMessageController,
} from "../controllers/message.controller.js";

const router = express.Router();

// Get conversation
router.get("/:receiverId", authMiddleware, getConversationController);

// Send message
router.post("/", authMiddleware, sendMessageController);

export default router;