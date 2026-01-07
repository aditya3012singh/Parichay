import {
  createBooking,
  getUserBookings,
  getUserBookingsByStatus,
  getProviderJobs,
  getProviderJobsByStatus,
  getProviderEarnings,
  updateBookingStatus,
} from "../services/booking.service.js";

// Create booking
export const createBookingController = async (req, res) => {
  try {
    const userId = req.user.id;
    const booking = await createBooking({
      ...req.body,
      userId,
    });

    res.status(201).json({ message: "Booking created", booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Get user's bookings
export const getUserBookingsController = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await getUserBookings(userId);
    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Get provider's jobs
export const getProviderJobsController = async (req, res) => {
  try {
    const providerId = req.user.id;
    const bookings = await getProviderJobs(providerId);
    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching provider jobs:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Update booking status
export const updateBookingStatusController = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await updateBookingStatus(bookingId, status);
    res.status(200).json({ message: "Booking updated", booking });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(400).json({ message: error.message || "Internal server error" });
  }
};

// ✅ NEW: Get user bookings by status
export const getUserBookingsByStatusController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.params;
    const bookings = await getUserBookingsByStatus(userId, status);
    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings by status:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// ✅ NEW: Get provider jobs by status
export const getProviderJobsByStatusController = async (req, res) => {
  try {
    const providerId = req.user.id;
    const { status } = req.params;
    const bookings = await getProviderJobsByStatus(providerId, status);
    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching jobs by status:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// ✅ NEW: Get provider earnings
export const getProviderEarningsController = async (req, res) => {
  try {
    const providerId = req.user.id;
    const earnings = await getProviderEarnings(providerId);
    res.status(200).json({ earnings });
  } catch (error) {
    console.error("Error fetching provider earnings:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
