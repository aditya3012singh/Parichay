import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get current provider's profile
export const getProviderProfile = async (userId) => {
  try {
    const profile = await prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new Error("Provider profile not found");
    }

    return profile;
  } catch (error) {
    console.error("Error fetching provider profile:", error);
    throw error;
  }
};

// Create or update provider profile
export const saveProviderProfile = async (userId, profileData) => {
  try {
    const existing = await prisma.providerProfile.findUnique({
      where: { userId },
    });

    const data = {
      ...profileData,
      userId,
    };

    let profile;
    if (existing) {
      profile = await prisma.providerProfile.update({
        where: { userId },
        data,
      });
    } else {
      profile = await prisma.providerProfile.create({ data });
    }

    return profile;
  } catch (error) {
    console.error("Error saving provider profile:", error);
    throw error;
  }
};

// Get all provider profiles
export const getAllProviders = async () => {
  try {
    const providers = await prisma.providerProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return providers;
  } catch (error) {
    console.error("Error fetching providers:", error);
    throw error;
  }
};

// ✅ NEW: Get provider's earnings and statistics
export const getProviderEarningsStats = async (userId) => {
  try {
    // Get all completed bookings
    const completedBookings = await prisma.booking.findMany({
      where: { providerId: userId, status: "COMPLETED" },
    });

    // Get pending (accepted) bookings
    const pendingBookings = await prisma.booking.findMany({
      where: { providerId: userId, status: "ACCEPTED" },
    });

    // Get cancelled bookings (for reference)
    const cancelledBookings = await prisma.booking.findMany({
      where: { providerId: userId, status: "CANCELLED" },
    });

    // Calculate totals
    const totalEarnings = completedBookings.reduce((sum, booking) => {
      return sum + booking.price * 0.85; // 85% to provider
    }, 0);

    const pendingEarnings = pendingBookings.reduce((sum, booking) => {
      return sum + booking.price * 0.85;
    }, 0);

    const totalBookings = completedBookings.length;
    const averageJobValue =
      totalBookings > 0
        ? parseFloat(
            (completedBookings.reduce((sum, b) => sum + b.price, 0) / totalBookings).toFixed(2)
          )
        : 0;

    // Get provider rating
    const reviews = await prisma.review.findMany({
      where: { providerId: userId },
    });

    const averageRating =
      reviews.length > 0
        ? parseFloat(
            (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
          )
        : 0;

    return {
      completedJobs: totalBookings,
      totalEarnings: parseFloat(totalEarnings.toFixed(2)),
      pendingEarnings: parseFloat(pendingEarnings.toFixed(2)),
      averageJobValue,
      totalReviews: reviews.length,
      averageRating,
      acceptanceRate: totalBookings > 0 ? ((totalBookings / (totalBookings + cancelledBookings.length)) * 100).toFixed(2) : "N/A",
      upcomingJobs: pendingBookings.length,
    };
  } catch (error) {
    console.error("Error calculating provider earnings:", error);
    throw error;
  }
};
