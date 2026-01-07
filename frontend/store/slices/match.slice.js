import { createSlice } from "@reduxjs/toolkit";
import {
  findNearbyProviders,
  searchProvidersByCategory,
  getProviderDetails,
} from "../api/match.thunk";

const initialState = {
  nearbyProviders: [],
  searchResults: [],
  providerDetails: null,
  loading: false,
  error: null,
};

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSearch: (state) => {
      state.nearbyProviders = [];
      state.searchResults = [];
      state.providerDetails = null;
    },
  },
  extraReducers: (builder) => {
    // Find nearby providers
    builder.addCase(findNearbyProviders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(findNearbyProviders.fulfilled, (state, action) => {
      state.loading = false;
      state.nearbyProviders = action.payload.data || action.payload;
    });
    builder.addCase(findNearbyProviders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Search providers by category
    builder.addCase(searchProvidersByCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(searchProvidersByCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.searchResults = action.payload.data || action.payload;
    });
    builder.addCase(searchProvidersByCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get provider details
    builder.addCase(getProviderDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getProviderDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.providerDetails = action.payload;
    });
    builder.addCase(getProviderDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError, resetSearch } = matchSlice.actions;
export default matchSlice.reducer;
