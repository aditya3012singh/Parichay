import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../lib/axios";

// Create availability slots
export const createAvailabilitySlots = createAsyncThunk(
  "availability/createSlots",
  async (slotsData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/availability/slots", slotsData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create availability slots"
      );
    }
  }
);

// Get provider availability slots
export const getProviderSlots = createAsyncThunk(
  "availability/getProviderSlots",
  async (providerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/availability/provider/${providerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch availability slots"
      );
    }
  }
);

// Update availability slot
export const updateAvailabilitySlot = createAsyncThunk(
  "availability/updateSlot",
  async ({ slotId, slotData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/availability/slots/${slotId}`,
        slotData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update availability slot"
      );
    }
  }
);

// Delete availability slot
export const deleteAvailabilitySlot = createAsyncThunk(
  "availability/deleteSlot",
  async (slotId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/availability/slots/${slotId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete availability slot"
      );
    }
  }
);
