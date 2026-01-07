import { PrismaClient } from "@prisma/client";
import { haversineDistance } from "../lib/geoHelpers.js";

const prisma = new PrismaClient();

// Find nearby providers
export const findNearbyProviders = async (latitude, longitude, radiusKm = 10) => {
  try {
    const providers = await prisma.providerProfile.findMany({
      where: {
        availability: true,
        verified: true,
      },
    });

    const nearby = providers.filter((p) => {
      const dist = haversineDistance(latitude, longitude, p.latitude, p.longitude);
      return dist <= radiusKm;
    });

    return nearby;
  } catch (error) {
    console.error("Error finding nearby providers:", error);
    throw error;
  }
};
