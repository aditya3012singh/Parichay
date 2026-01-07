import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all categories
export const getAllCategories = async () => {
  try {
    const categories = await prisma.serviceCategory.findMany();
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Create category (admin)
export const createCategory = async (categoryData) => {
  try {
    const { name, image } = categoryData;
    const category = await prisma.serviceCategory.create({
      data: { name, image },
    });

    return category;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};
