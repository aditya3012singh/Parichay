import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";

// Generate OTP
export const generateOTP = createAsyncThunk(
  "auth/generateOTP",
  async ({ email }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/v1/auth/generate-otp", { email });
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to generate OTP"
      );
    }
  }
);

// Verify OTP
export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/v1/auth/verify-otp", { email, otp });
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to verify OTP"
      );
    }
  }
);

// Signup
export const signup = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/v1/auth/signup", userData);
      if (data.token) {
        localStorage.setItem("token", data.token);
        api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      }
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Signup failed"
      );
    }
  }
);

// Signin
export const signin = createAsyncThunk(
  "auth/signin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/v1/auth/signin", { email, password });
      if (data.token) {
        localStorage.setItem("token", data.token);
        api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      }
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Login failed"
      );
    }
  }
);

// Get Current User
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const { data } = await api.get("/v1/auth/get-me");
      return data.user;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

// Update Profile
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      const { data } = await api.put("/v1/auth/update-profile", profileData);
      return data.user;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update profile"
      );
    }
  }
);