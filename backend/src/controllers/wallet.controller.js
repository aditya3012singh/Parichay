import {
  getWalletBalance,
  getWalletTransactions,
  topupWallet,
} from "../services/wallet.service.js";

// Get wallet balance
export const getWalletController = async (req, res) => {
  try {
    const userId = req.user.id;
    const wallet = await getWalletBalance(userId);
    res.status(200).json({ wallet });
  } catch (error) {
    console.error("Error fetching wallet:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Get transactions
export const getTransactionsController = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await getWalletTransactions(userId);
    res.status(200).json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Topup wallet
export const topupWalletController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Valid amount is required" });
    }

    const result = await topupWallet(userId, amount);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error topping up wallet:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
