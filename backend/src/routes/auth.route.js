import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import {
  generateOTPController,
  verifyOTPController,
  checkAdminController,
  checkUserController,
  signupController,
  signinController,
  getMeController,
  getAllUsersController,
  updateProfileController,
  deleteUserController,
} from "../controllers/auth.controller.js";

const router = express.Router();

// OTP Routes
router.post("/generate-otp", generateOTPController);
router.post("/verify-otp", verifyOTPController);

// Check Routes
router.get("/check-admin", checkAdminController);
router.get("/check-user", checkUserController);

// Auth Routes
router.post("/signup", signupController);
router.post("/signin", signinController);

// User Routes
router.get("/me", authMiddleware, getMeController);
router.get("/users", authMiddleware, isAdmin, getAllUsersController);
router.put("/update-profile", authMiddleware, updateProfileController);
router.delete("/user", authMiddleware, isAdmin, deleteUserController);

export default router;
