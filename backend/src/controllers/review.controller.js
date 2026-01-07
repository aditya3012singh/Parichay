import {
  createReview,
  getProviderReviews,
  getProviderAverageRating,
} from "../services/review.service.js";

// Create review
export const createReviewController = async (req, res) => {
  try {
    const userId = req.user.id;
    const review = await createReview(userId, req.body);
    res.status(201).json({ message: "Review submitted", review });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Get provider reviews
export const getProviderReviewsController = async (req, res) => {
  try {
    const { providerId } = req.params;
    const reviews = await getProviderReviews(providerId);
    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Get provider average rating
export const getAverageRatingController = async (req, res) => {
  try {
    const { providerId } = req.params;
    const averageRating = await getProviderAverageRating(providerId);
    res.status(200).json({ averageRating });
  } catch (error) {
    console.error("Error calculating average rating:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
