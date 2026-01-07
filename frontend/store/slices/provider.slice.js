import { createSlice } from "@reduxjs/toolkit";
import { 
  createProviderProfile, 
  getProviderProfile, 
  updateProviderProfile,
  getAllProviders,
  findNearbyProviders,
  getProviderEarningsStats 
} from "../api/provider.thunk";

const initialState = {
  profile: null,
  providers: [],
  nearbyProviders: [],
  earnings: null,
  loading: false,
  error: null,
};

const providerSlice = createSlice({
  name: "provider",
  initialState,
  reducers: {
    clearProviderError: (state) => {
      state.error = null;
    },
    clearNearbyProviders: (state) => {
      state.nearbyProviders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Provider Profile
      .addCase(createProviderProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProviderProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(createProviderProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Provider Profile
      .addCase(getProviderProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProviderProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getProviderProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Provider Profile
      .addCase(updateProviderProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProviderProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProviderProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get All Providers
      .addCase(getAllProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProviders.fulfilled, (state, action) => {
        state.loading = false;
        state.providers = action.payload;
      })
      .addCase(getAllProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Find Nearby Providers
      .addCase(findNearbyProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findNearbyProviders.fulfilled, (state, action) => {
        state.loading = false;
        state.nearbyProviders = action.payload;
      })
      .addCase(findNearbyProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ✅ NEW: Get Provider Earnings Stats
      .addCase(getProviderEarningsStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProviderEarningsStats.fulfilled, (state, action) => {
        state.loading = false;
        state.earnings = action.payload;
      })
      .addCase(getProviderEarningsStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProviderError, clearNearbyProviders } = providerSlice.actions;
export default providerSlice.reducer;
