import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";

// Create Provider Profile
export const createProviderProfile = createAsyncThunk(
  "provider/create",
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      const { data } = await api.post("/v1/provider", profileData);
      return data.provider;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to create provider profile"
      );
    }
  }
);

// Get Provider Profile
export const getProviderProfile = createAsyncThunk(
  "provider/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      const { data } = await api.get("/v1/provider/profile");
      return data.provider;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch provider profile"
      );
    }
  }
);

// Update Provider Profile
export const updateProviderProfile = createAsyncThunk(
  "provider/update",
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      const { data } = await api.put("/v1/provider/profile", profileData);
      return data.provider;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update provider profile"
      );
    }
  }
);

// Get All Providers
export const getAllProviders = createAsyncThunk(
  "provider/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/v1/provider/all");
      return data.providers;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch providers"
      );
    }
  }
);

// Find Nearby Providers
export const findNearbyProviders = createAsyncThunk(
  "provider/findNearby",
  async ({ latitude, longitude, serviceId, radius = 10 }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/v1/match/nearby", {
        latitude,
        longitude,
        serviceId,
        radius
      });
      return data.providers;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to find nearby providers"
      );
    }
  }
);

// ✅ NEW: Get Provider Earnings Stats
export const getProviderEarningsStats = createAsyncThunk(
  "provider/getEarnings",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      const { data } = await api.get("/v1/provider/earnings");
      return data.earnings;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch provider earnings"
      );
    }
  }
);
