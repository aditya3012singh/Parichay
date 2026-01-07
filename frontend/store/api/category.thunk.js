import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";

// Get Categories
export const getCategories = createAsyncThunk(
  "category/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/v1/categories");
      return data.categories;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);
