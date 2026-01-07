import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get wallet balance
export const getWalletBalance = async (userId) => {
  try {
    let wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    // Auto-create wallet if not exists
    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { userId },
      });
    }

    return wallet;
  } catch (error) {
    console.error("Error fetching wallet:", error);
    throw error;
  }
};

// Get wallet transactions
export const getWalletTransactions = async (userId) => {
  try {
    const transactions = await prisma.walletTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

// Top up wallet
export const topupWallet = async (userId, amount) => {
  try {
    // Ensure wallet exists
    let wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { userId },
      });
    }

    // Create transaction
    const transaction = await prisma.walletTransaction.create({
      data: {
        userId,
        walletId: wallet.id,
        amount,
        type: "CREDIT",
        source: "TOPUP",
      },
    });

    // Update balance
    await prisma.wallet.update({
      where: { userId },
      data: { balance: wallet.balance + amount },
    });

    return { message: "Wallet topped up successfully", transaction };
  } catch (error) {
    console.error("Error topping up wallet:", error);
    throw error;
  }
};
