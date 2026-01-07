import { createSlice } from "@reduxjs/toolkit";
import { 
  getWalletBalance, 
  getTransactions, 
  topUpWallet 
} from "../api/wallet.thunk";

const initialState = {
  balance: 0,
  transactions: [],
  loading: false,
  error: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    clearWalletError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Wallet Balance
      .addCase(getWalletBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWalletBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.balance;
      })
      .addCase(getWalletBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Transactions
      .addCase(getTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Top Up Wallet
      .addCase(topUpWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(topUpWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.balance;
        state.transactions.unshift(action.payload.transaction);
      })
      .addCase(topUpWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWalletError } = walletSlice.actions;
export default walletSlice.reducer;
