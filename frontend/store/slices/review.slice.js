import { createSlice } from "@reduxjs/toolkit";
import {
  createReview,
  getProviderReviews,
  getMyReviews,
} from "../api/review.thunk";

const initialState = {
  reviews: [],
  providerReviews: [],
  myReviews: [],
  loading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetReviews: (state) => {
      state.reviews = [];
      state.providerReviews = [];
      state.myReviews = [];
    },
  },
  extraReducers: (builder) => {
    // Create review
    builder.addCase(createReview.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createReview.fulfilled, (state, action) => {
      state.loading = false;
      state.reviews.push(action.payload);
    });
    builder.addCase(createReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get provider reviews
    builder.addCase(getProviderReviews.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getProviderReviews.fulfilled, (state, action) => {
      state.loading = false;
      state.providerReviews = action.payload.data || action.payload;
    });
    builder.addCase(getProviderReviews.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get my reviews
    builder.addCase(getMyReviews.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getMyReviews.fulfilled, (state, action) => {
      state.loading = false;
      state.myReviews = action.payload.data || action.payload;
    });
    builder.addCase(getMyReviews.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError, resetReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
