import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getWalletController,
  getTransactionsController,
  topupWalletController,
} from "../controllers/wallet.controller.js";

const router = express.Router();

// Get wallet balance
router.get("/", authMiddleware, getWalletController);

// Get transactions
router.get("/transactions", authMiddleware, getTransactionsController);

// Topup wallet
router.post("/topup", authMiddleware, topupWalletController);

export default router;