import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";

// Create Booking
export const createBooking = createAsyncThunk(
  "booking/create",
  async (bookingData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      const { data } = await api.post("/v1/booking", bookingData);
      return data.booking;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to create booking"
      );
    }
  }
);

// Get My Bookings
export const getMyBookings = createAsyncThunk(
  "booking/getMyBookings",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      const { data } = await api.get("/v1/booking/my-bookings");
      return data.bookings;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch bookings"
      );
    }
  }
);

// ✅ NEW: Get My Bookings by Status
export const getMyBookingsByStatus = createAsyncThunk(
  "booking/getByStatus",
  async (status, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      const { data } = await api.get(`/v1/booking/my-bookings/${status}`);
      return data.bookings;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch bookings by status"
      );
    }
  }
);

// Get My Jobs (for providers)
export const getMyJobs = createAsyncThunk(
  "booking/getMyJobs",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      const { data } = await api.get("/v1/booking/my-jobs");
      return data.jobs;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch jobs"
      );
    }
  }
);

// ✅ NEW: Get My Jobs by Status
export const getMyJobsByStatus = createAsyncThunk(
  "booking/getJobsByStatus",
  async (status, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      const { data } = await api.get(`/v1/booking/my-jobs/${status}`);
      return data.bookings;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch jobs by status"
      );
    }
  }
);

// Update Booking Status
export const updateBookingStatus = createAsyncThunk(
  "booking/updateStatus",
  async ({ bookingId, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      const { data } = await api.put(`/v1/booking/${bookingId}/status`, { status });
      return data.booking;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update booking status"
      );
    }
  }
);

// ✅ NEW: Get Provider Earnings
export const getProviderEarnings = createAsyncThunk(
  "booking/getEarnings",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      const { data } = await api.get("/v1/booking/my-earnings");
      return data.earnings;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch earnings"
      );
    }
  }
);
