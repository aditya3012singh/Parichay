import { createSlice } from "@reduxjs/toolkit";
import { 
  createBooking, 
  getMyBookings,
  getMyBookingsByStatus,
  getMyJobs,
  getMyJobsByStatus,
  getProviderEarnings,
  updateBookingStatus 
} from "../api/booking.thunk";

const initialState = {
  bookings: [],
  bookingsByStatus: [],
  jobs: [],
  jobsByStatus: [],
  earnings: null,
  currentBooking: null,
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearBookingError: (state) => {
      state.error = null;
    },
    setCurrentBooking: (state, action) => {
      state.currentBooking = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.unshift(action.payload);
        state.currentBooking = action.payload;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get My Bookings
      .addCase(getMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(getMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ✅ NEW: Get My Bookings by Status
      .addCase(getMyBookingsByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyBookingsByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingsByStatus = action.payload;
      })
      .addCase(getMyBookingsByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get My Jobs (for providers)
      .addCase(getMyJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(getMyJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ✅ NEW: Get My Jobs by Status
      .addCase(getMyJobsByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyJobsByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.jobsByStatus = action.payload;
      })
      .addCase(getMyJobsByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ✅ NEW: Get Provider Earnings
      .addCase(getProviderEarnings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProviderEarnings.fulfilled, (state, action) => {
        state.loading = false;
        state.earnings = action.payload;
      })
      .addCase(getProviderEarnings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Booking Status
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        const jobIndex = state.jobs.findIndex(j => j.id === action.payload.id);
        if (jobIndex !== -1) {
          state.jobs[jobIndex] = action.payload;
        }
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBookingError, setCurrentBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
