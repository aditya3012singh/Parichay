import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../lib/axios";

// Find nearby providers
export const findNearbyProviders = createAsyncThunk(
  "match/findNearbyProviders",
  async (
    { latitude, longitude, radius = 5, category = null, page = 1, limit = 10 },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams({
        latitude,
        longitude,
        radius,
        page,
        limit,
      });
      if (category) params.append("category", category);

      const response = await axios.get(`/match/nearby?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to find nearby providers"
      );
    }
  }
);

// Search providers by category and location
export const searchProvidersByCategory = createAsyncThunk(
  "match/searchByCategory",
  async (
    {
      category,
      latitude,
      longitude,
      radius = 10,
      minRating = 0,
      page = 1,
      limit = 10,
    },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams({
        category,
        latitude,
        longitude,
        radius,
        minRating,
        page,
        limit,
      });

      const response = await axios.get(`/match/search?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search providers"
      );
    }
  }
);

// Get provider details with availability
export const getProviderDetails = createAsyncThunk(
  "match/getProviderDetails",
  async (providerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/match/provider/${providerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch provider details"
      );
    }
  }
);
