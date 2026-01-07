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
