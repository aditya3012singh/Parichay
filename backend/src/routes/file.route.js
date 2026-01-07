import express from "express";
import multer from "multer";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { uploadFileController, getUserFilesController } from "../controllers/file.controller.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const router = express.Router();

// Setup Multer (local storage)
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({ storage });

// Upload file
router.post("/upload", authMiddleware, upload.single("file"), uploadFileController);

// Get user files
router.get("/user/:userId", getUserFilesController);

export default router;