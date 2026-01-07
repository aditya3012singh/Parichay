import {
  findNearbyProviders,
} from "../services/match.service.js";

// Find nearby providers
export const findNearbyController = async (req, res) => {
  try {
    const { latitude, longitude, radiusKm = 10 } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        message: "Latitude and longitude are required",
      });
    }

    const nearby = await findNearbyProviders(latitude, longitude, radiusKm);
    res.json({ nearby });
  } catch (error) {
    console.error("Geo Match Error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};
