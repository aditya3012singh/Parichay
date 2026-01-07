import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create review
export const createReview = async (userId, reviewData) => {
  try {
    const { providerId, rating, comment } = reviewData;

    const review = await prisma.review.create({
      data: {
        userId,
        providerId,
        rating,
        comment,
      },
    });

    return review;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

// Get provider reviews
export const getProviderReviews = async (providerId) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { providerId },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

// Get provider average rating
export const getProviderAverageRating = async (providerId) => {
  try {
    const result = await prisma.review.aggregate({
      where: { providerId },
      _avg: { rating: true },
    });

    return result._avg.rating ?? 0;
  } catch (error) {
    console.error("Error calculating average rating:", error);
    throw error;
  }
};
