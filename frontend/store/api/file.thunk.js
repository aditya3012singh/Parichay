import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../lib/axios";

// Upload file
export const uploadFile = createAsyncThunk(
  "file/uploadFile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload file"
      );
    }
  }
);

// Get user files
export const getUserFiles = createAsyncThunk(
  "file/getUserFiles",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/files/my-files?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch files"
      );
    }
  }
);

// Delete file
export const deleteFile = createAsyncThunk(
  "file/deleteFile",
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/files/${fileId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete file"
      );
    }
  }
);

// Download file
export const downloadFile = createAsyncThunk(
  "file/downloadFile",
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/files/download/${fileId}`, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to download file"
      );
    }
  }
);
