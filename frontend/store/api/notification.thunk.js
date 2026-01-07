import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";

// Get Notifications
export const getNotifications = createAsyncThunk(
  "notification/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      const { data } = await api.get("/v1/notifications");
      return data.notifications;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch notifications"
      );
    }
  }
);

// Mark As Read
export const markAsRead = createAsyncThunk(
  "notification/markAsRead",
  async ({ notificationId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      const { data } = await api.put(`/v1/notifications/${notificationId}/read`);
      return data.notification;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to mark notification as read"
      );
    }
  }
);
