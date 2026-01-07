import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../lib/axios";

// Get active coupons
export const getActiveCoupons = createAsyncThunk(
  "coupon/getActiveCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/coupons/active");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch coupons"
      );
    }
  }
);

// Validate coupon code
export const validateCoupon = createAsyncThunk(
  "coupon/validateCoupon",
  async ({ code, amount }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/coupons/validate", { code, amount });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Invalid coupon code"
      );
    }
  }
);

// Apply coupon to booking
export const applyCouponToBooking = createAsyncThunk(
  "coupon/applyToBooking",
  async ({ bookingId, couponCode }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `/coupons/apply/${bookingId}`,
        { couponCode }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to apply coupon"
      );
    }
  }
);
