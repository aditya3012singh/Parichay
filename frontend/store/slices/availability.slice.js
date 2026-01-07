import { createSlice } from "@reduxjs/toolkit";
import {
  createAvailabilitySlots,
  getProviderSlots,
  updateAvailabilitySlot,
  deleteAvailabilitySlot,
} from "../api/availability.thunk";

const initialState = {
  slots: [],
  providerSlots: [],
  loading: false,
  error: null,
};

const availabilitySlice = createSlice({
  name: "availability",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSlots: (state) => {
      state.slots = [];
      state.providerSlots = [];
    },
  },
  extraReducers: (builder) => {
    // Create availability slots
    builder.addCase(createAvailabilitySlots.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createAvailabilitySlots.fulfilled, (state, action) => {
      state.loading = false;
      state.slots = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
    });
    builder.addCase(createAvailabilitySlots.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get provider slots
    builder.addCase(getProviderSlots.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getProviderSlots.fulfilled, (state, action) => {
      state.loading = false;
      state.providerSlots = action.payload.data || action.payload;
    });
    builder.addCase(getProviderSlots.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update availability slot
    builder.addCase(updateAvailabilitySlot.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateAvailabilitySlot.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.providerSlots.findIndex(
        (slot) => slot.id === action.payload.id
      );
      if (index !== -1) {
        state.providerSlots[index] = action.payload;
      }
    });
    builder.addCase(updateAvailabilitySlot.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Delete availability slot
    builder.addCase(deleteAvailabilitySlot.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteAvailabilitySlot.fulfilled, (state, action) => {
      state.loading = false;
      state.providerSlots = state.providerSlots.filter(
        (slot) => slot.id !== action.payload.id
      );
    });
    builder.addCase(deleteAvailabilitySlot.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError, resetSlots } = availabilitySlice.actions;
export default availabilitySlice.reducer;
