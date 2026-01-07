import { createSlice } from "@reduxjs/toolkit";
import {
  getActiveCoupons,
  validateCoupon,
  applyCouponToBooking,
} from "../api/coupon.thunk";

const initialState = {
  coupons: [],
  validationResult: null,
  loading: false,
  error: null,
};

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearValidation: (state) => {
      state.validationResult = null;
    },
    resetCoupons: (state) => {
      state.coupons = [];
      state.validationResult = null;
    },
  },
  extraReducers: (builder) => {
    // Get active coupons
    builder.addCase(getActiveCoupons.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getActiveCoupons.fulfilled, (state, action) => {
      state.loading = false;
      state.coupons = action.payload.data || action.payload;
    });
    builder.addCase(getActiveCoupons.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Validate coupon
    builder.addCase(validateCoupon.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(validateCoupon.fulfilled, (state, action) => {
      state.loading = false;
      state.validationResult = action.payload;
    });
    builder.addCase(validateCoupon.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.validationResult = null;
    });

    // Apply coupon to booking
    builder.addCase(applyCouponToBooking.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(applyCouponToBooking.fulfilled, (state, action) => {
      state.loading = false;
      state.validationResult = action.payload;
    });
    builder.addCase(applyCouponToBooking.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError, clearValidation, resetCoupons } =
  couponSlice.actions;
export default couponSlice.reducer;
