import {
  uploadFile,
  getUserFiles,
} from "../services/file.service.js";

// Upload file
export const uploadFileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!type) {
      return res.status(400).json({ message: "File type is required" });
    }

    const fileData = {
      url: `/uploads/${req.file.filename}`,
      type,
    };

    const file = await uploadFile(userId, fileData);
    res.status(201).json({ message: "File uploaded", file });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Get user files
export const getUserFilesController = async (req, res) => {
  try {
    const { userId } = req.params;
    const files = await getUserFiles(userId);
    res.status(200).json({ files });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
