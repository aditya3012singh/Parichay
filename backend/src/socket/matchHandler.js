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

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
}
