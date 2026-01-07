import { createSlice } from "@reduxjs/toolkit";
import {
  sendMessage,
  getConversation,
  getAllConversations,
} from "../api/message.thunk";

const initialState = {
  conversations: [],
  currentConversation: [],
  allConversations: [],
  loading: false,
  error: null,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetMessages: (state) => {
      state.conversations = [];
      state.currentConversation = [];
      state.allConversations = [];
    },
  },
  extraReducers: (builder) => {
    // Send message
    builder.addCase(sendMessage.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.loading = false;
      state.currentConversation.push(action.payload);
    });
    builder.addCase(sendMessage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get conversation
    builder.addCase(getConversation.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getConversation.fulfilled, (state, action) => {
      state.loading = false;
      state.currentConversation = action.payload.data || action.payload;
    });
    builder.addCase(getConversation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get all conversations
    builder.addCase(getAllConversations.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllConversations.fulfilled, (state, action) => {
      state.loading = false;
      state.allConversations = action.payload.data || action.payload;
    });
    builder.addCase(getAllConversations.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError, resetMessages } = messageSlice.actions;
export default messageSlice.reducer;
