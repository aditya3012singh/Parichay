import { PrismaClient } from "@prisma/client";
import { createNotification } from "./notification.service.js";

const prisma = new PrismaClient();

// Create booking
export const createBooking = async (bookingData) => {
  try {
    const booking = await prisma.booking.create({
      data: {
        ...bookingData,
        dateTime: new Date(bookingData.dateTime),
      },
      include: { user: true, provider: { include: { user: true } } },
    });

    // ✅ NEW: Send notification to provider
    try {
      await createNotification(
        booking.providerId,
        `New booking request from ${booking.user.name} - $${booking.price}`,
        "BOOKING_REQUEST"
      );
    } catch (notifError) {
      console.warn("Warning: Could not create notification", notifError);
    }

    return booking;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

// Get user's bookings
export const getUserBookings = async (userId) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: { provider: { include: { user: true } } },
      orderBy: { createdAt: "desc" },
    });

    return bookings;
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    throw error;
  }
};

// ✅ NEW: Get user bookings by status
export const getUserBookingsByStatus = async (userId, status) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId, status },
      include: { provider: { include: { user: true } } },
      orderBy: { createdAt: "desc" },
    });

    return bookings;
  } catch (error) {
    console.error("Error fetching bookings by status:", error);
    throw error;
  }
};

// Get provider's jobs
export const getProviderJobs = async (providerId) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { providerId },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    return bookings;
  } catch (error) {
    console.error("Error fetching provider jobs:", error);
    throw error;
  }
};

// ✅ NEW: Get provider jobs by status
export const getProviderJobsByStatus = async (providerId, status) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { providerId, status },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
// Get booking details before update
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { user: true, provider: { include: { user: true } } },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    // ✅ NEW: Handle status transitions with notifications and payments
    if (status === "ACCEPTED") {
      // Notify customer that provider accepted
      await createNotification(
        booking.userId,
        `${booking.provider.user.name} accepted your booking!`,
        "BOOKING_ACCEPTED"
      );
    }

    if (status === "COMPLETED") {
      // ✅ NEW: AUTO PAYMENT PROCESSING
      try {
        // Deduct from customer wallet
        const userWallet = await prisma.wallet.findUnique({
          where: { userId: booking.userId },
        });

        if (!userWallet || userWallet.balance < booking.price) {
          throw new Error("Insufficient wallet balance");
        }

        await prisma.wallet.update({
          where: { userId: booking.userId },
          data: { balance: { decrement: booking.price } },
        });

        // Add to provider wallet (85% after 15% platform fee)
        const providerWallet = await prisma.wallet.findUnique({
          where: { userId: booking.providerId },
        });

        const providerEarning = booking.price * 0.85;

        await prisma.wallet.update({
          where: { userId: booking.providerId },
          data: { balance: { increment: providerEarning } },
        });

        // Log customer transaction
        await prisma.walletTransaction.create({
          data: {
            userId: booking.userId,
            walletId: userWallet.id,
            amount: booking.price,
            type: "DEBIT",
            source: "BOOKING_PAYMENT",
          },
        });

        // Log provider transaction
        await prisma.walletTransaction.create({
          data: {
            userId: booking.providerId,
            walletId: providerWallet.id,
            amount: providerEarning,
            type: "CREDIT",
            source: "BOOKING_COMPLETION",
          },
        });

        // Notify customer about payment
        await createNotification(
          booking.userId,
          `Service completed! You have been charged $${booking.price}. Remaining balance: $${(userWallet.balance - booking.price).toFixed(2)}`,
          "BOOKING_COMPLETED_CHARGED"
        );

        // Notify provider about earnings
        await createNotification(
          booking.providerId,
          `Service completed! You earned $${providerEarning.toFixed(2)}. New balance: $${(providerWallet.balance + providerEarning).toFixed(2)}`,
          "EARNINGS_CREDITED"
        );
      } catch (paymentError) {
        console.error("Payment processing error:", paymentError);
        throw new Error(
          `Payment failed: ${paymentError.message}`
        );
      }
    }

    if (status === "CANCELLED") {
      // ✅ NEW: REFUND ON CANCELLATION
      if (booking.status === "ACCEPTED") {
        try {
          const userWallet = await prisma.wallet.findUnique({
            where: { userId: booking.userId },
          });

          // Refund customer
          await prisma.wallet.update({
            where: { userId: booking.userId },
            data: { balance: { increment: booking.price } },
          });

          // Log refund transaction
          await prisma.walletTransaction.create({
            data: {
              userId: booking.userId,
              walletId: userWallet.id,
              amount: booking.price,
              type: "CREDIT",
              source: "BOOKING_REFUND",
            },
          });

          // Notify customer about refund
          await createNotification(
            booking.userId,
            `Booking cancelled. You have been refunded $${booking.price}`,
            "BOOKING_REFUNDED"
          );

          // Notify provider about cancellation
          await createNotification(
            booking.providerId,
            `Your booking with ${booking.user.name} was cancelled`,
            "BOOKING_CANCELLED"
          );
        } catch (refundError) {
          console.error("Refund processing error:", refundError);
        }
      }
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: { user: true, provider: { include: { user: true } } },
    });

    return updatedB
};

// ✅ NEW: Get provider earnings
export const getProviderEarnings = async (providerId) => {
  try {
    const completedBookings = await prisma.booking.findMany({
      where: { providerId, status: "COMPLETED" },
    });

    const totalEarnings = completedBookings.reduce((sum, booking) => {
      return sum + booking.price * 0.85; // 85% to provider, 15% platform fee
    }, 0);

    const pendingEarnings = await prisma.booking.aggregate({
      where: { providerId, status: "ACCEPTED" },
      _sum: { price: true },
    });

    return {
      completedJobs: completedBookings.length,
      totalEarnings: parseFloat(totalEarnings.toFixed(2)),
      pendingEarnings: parseFloat((pendingEarnings._sum?.price || 0) * 0.85).toFixed(2),
      averageJobValue:
        completedBookings.length > 0
          ? parseFloat(
              (completedBookings.reduce((sum, b) => sum + b.price, 0) /
                completedBookings.length).toFixed(2)
            )
          : 0,
    };
  } catch (error) {
    console.error("Error calculating provider earnings:", error);
    throw error;
  }
};

// Update booking status
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const validStatuses = ["ACCEPTED", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid status value");
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    return booking;
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
};
