import { createSlice } from "@reduxjs/toolkit";
import {
  uploadFile,
  getUserFiles,
  deleteFile,
  downloadFile,
} from "../api/file.thunk";

const initialState = {
  files: [],
  userFiles: [],
  uploadedFile: null,
  loading: false,
  error: null,
};

const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetFiles: (state) => {
      state.files = [];
      state.userFiles = [];
      state.uploadedFile = null;
    },
  },
  extraReducers: (builder) => {
    // Upload file
    builder.addCase(uploadFile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(uploadFile.fulfilled, (state, action) => {
      state.loading = false;
      state.uploadedFile = action.payload;
      state.files.push(action.payload);
    });
    builder.addCase(uploadFile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get user files
    builder.addCase(getUserFiles.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getUserFiles.fulfilled, (state, action) => {
      state.loading = false;
      state.userFiles = action.payload.data || action.payload;
    });
    builder.addCase(getUserFiles.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Delete file
    builder.addCase(deleteFile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteFile.fulfilled, (state, action) => {
      state.loading = false;
      state.userFiles = state.userFiles.filter(
        (file) => file.id !== action.payload.id
      );
    });
    builder.addCase(deleteFile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Download file
    builder.addCase(downloadFile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(downloadFile.fulfilled, (state, action) => {
      state.loading = false;
      // Handle file download on client side
    });
    builder.addCase(downloadFile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError, resetFiles } = fileSlice.actions;
export default fileSlice.reducer;
