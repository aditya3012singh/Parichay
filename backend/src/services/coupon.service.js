import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all active coupons
export const getActiveCoupons = async () => {
  try {
    const coupons = await prisma.coupon.findMany({
      where: {
        isActive: true,
        expiryDate: { gt: new Date() },
      },
      orderBy: { expiryDate: "asc" },
    });

    return coupons;
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw error;
  }
};

// Create coupon (admin)
export const createCoupon = async (couponData) => {
  try {
    const { code, discount, maxAmount, expiryDate } = couponData;
    const coupon = await prisma.coupon.create({
      data: {
        code,
        discount,
        maxAmount,
        expiryDate,
        isActive: true,
      },
    });

    return coupon;
  } catch (error) {
    console.error("Error creating coupon:", error);
    throw error;
  }
};
