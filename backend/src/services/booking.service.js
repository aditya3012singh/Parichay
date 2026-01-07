import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create booking
export const createBooking = async (bookingData) => {
  try {
    const booking = await prisma.booking.create({
      data: {
        ...bookingData,
        dateTime: new Date(bookingData.dateTime),
      },
    });

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
      include: { provider: true },
      orderBy: { createdAt: "desc" },
    });

    return bookings;
  } catch (error) {
    console.error("Error fetching user bookings:", error);
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
