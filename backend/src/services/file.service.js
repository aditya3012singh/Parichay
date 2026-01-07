import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Upload file
export const uploadFile = async (userId, fileData) => {
  try {
    const uploaded = await prisma.file.create({
      data: {
        userId,
        ...fileData,
      },
    });

    return uploaded;
  } catch (error) {
    console.error("Error saving file:", error);
    throw error;
  }
};

// Get user files
export const getUserFiles = async (userId) => {
  try {
    const files = await prisma.file.findMany({
      where: { userId },
    });

    return files;
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error;
  }
};
