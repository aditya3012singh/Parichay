import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";

// Get Wallet Balance
export const getWalletBalance = createAsyncThunk(
  "wallet/getBalance",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      const { data } = await api.get("/v1/wallet/balance");
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch wallet balance"
      );
    }
  }
);

// Get Transactions
export const getTransactions = createAsyncThunk(
  "wallet/getTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      const { data } = await api.get("/v1/wallet/transactions");
      return data.transactions;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch transactions"
      );
    }
  }
);

// Top Up Wallet
export const topUpWallet = createAsyncThunk(
  "wallet/topUp",
  async ({ amount }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      const { data } = await api.post("/v1/wallet/topup", { amount });
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to top up wallet"
      );
    }
  }
);
