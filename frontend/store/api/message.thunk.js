import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../lib/axios";

// Send a message
export const sendMessage = createAsyncThunk(
  "message/sendMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/messages/send", messageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send message"
      );
    }
  }
);

// Get conversation with a user
export const getConversation = createAsyncThunk(
  "message/getConversation",
  async ({ userId, page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/messages/conversation/${userId}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch conversation"
      );
    }
  }
);

// Get all conversations
export const getAllConversations = createAsyncThunk(
  "message/getAllConversations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/messages/conversations");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch conversations"
      );
    }
  }
);
