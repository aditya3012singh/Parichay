import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../lib/axios";

// Create a review
export const createReview = createAsyncThunk(
  "review/createReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/reviews/create", reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create review"
      );
    }
  }
);

// Get provider reviews
export const getProviderReviews = createAsyncThunk(
  "review/getProviderReviews",
  async (providerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/reviews/provider/${providerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reviews"
      );
    }
  }
);

// Get my reviews (as provider)
export const getMyReviews = createAsyncThunk(
  "review/getMyReviews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/reviews/my-reviews");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch my reviews"
      );
    }
  }
);
