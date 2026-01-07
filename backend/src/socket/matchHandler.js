// socket/matchHandler.js
import { findNearbyProviders } from "../services/match.service.js";
import { haversineDistance } from "../lib/geoHelpers.js";

export function setupMatchingSocket(io) {
  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    socket.on("request-service", async (data) => {
      const { userLat, userLon, serviceId, category, radius = 10 } = data;

      try {
        // Use the service to find nearby providers
        const providers = await findNearbyProviders(userLat, userLon, radius);

        // Notify nearby providers about service request
        providers.forEach((provider) => {
          io.to(provider.userId).emit("service-request", {
            customer: socket.id,
            location: { lat: userLat, lon: userLon },
            serviceId,
            category,
          });
        });

        // Confirm to customer
        socket.emit("providers-notified", {
          count: providers.length,
          providers: providers.map((p) => ({
            id: p.id,
            name: p.User?.name,
            distance: haversineDistance(
              userLat,
              userLon,
              p.latitude,
              p.longitude
            ).toFixed(2),
          })),
        });
      } catch (error) {
        console.error("❌ Error finding providers:", error);
        socket.emit("error", { message: "Failed to find providers" });
      }
    });

    socket.on("provider-accept", async (data) => {
      const { bookingId, providerId, customerId } = data;
      // Notify customer that provider accepted
      io.to(customerId).emit("provider-accepted", {
        providerId,
        bookingId,
      });
    });

    // ✅ NEW: Booking room handlers for real-time messaging
    socket.on("join-booking", (data) => {
      const { bookingId, userId } = data;
      const roomName = `booking-${bookingId}`;
      socket.join(roomName);
      console.log(`✅ User ${userId} joined booking room: ${roomName}`);
      
      // Notify others in the room
      socket.to(roomName).emit("user-joined", {
        userId,
        timestamp: new Date(),
      });
    });

    socket.on("leave-booking", (data) => {
      const { bookingId, userId } = data;
      const roomName = `booking-${bookingId}`;
      socket.leave(roomName);
      console.log(`❌ User ${userId} left booking room: ${roomName}`);
      
      // Notify others in the room
      socket.to(roomName).emit("user-left", {
        userId,
        timestamp: new Date(),
      });
    });

    // ✅ NEW: Booking message handler (in-app chat for specific booking)
    socket.on("booking-message", (data) => {
      const { bookingId, userId, message, senderName } = data;
      const roomName = `booking-${bookingId}`;
      
      // Broadcast to everyone in the booking room
      io.to(roomName).emit("new-booking-message", {
        bookingId,
        userId,
        senderName,
        message,
        timestamp: new Date(),
      });
      
      console.log(`💬 Message in booking ${bookingId}: ${message}`);
    });

    // ✅ NEW: Booking status update with real-time notification
    socket.on("update-booking-status", (data) => {
      const { bookingId, status, userId, updatedBy } = data;
      const roomName = `booking-${bookingId}`;
      
      // Broadcast status change to everyone in the room
      io.to(roomName).emit("booking-status-changed", {
        bookingId,
        newStatus: status,
        updatedBy,
        timestamp: new Date(),
      });
      
      // Also emit globally for dashboard updates
      io.emit("global-booking-status-changed", {
        bookingId,
        status,
        userId,
      });
      
      console.log(`🔄 Booking ${bookingId} status updated to: ${status}`);
    });

    // ✅ NEW: Live location tracking for ongoing service
    socket.on("location-update", (data) => {
      const { bookingId, lat, lon, userId } = data;
      const roomName = `booking-${bookingId}`;
      
      // Broadcast location to booking room
      io.to(roomName).emit("provider-location-updated", {
        bookingId,
        lat,
        lon,
        userId,
        timestamp: new Date(),
      });
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
}
