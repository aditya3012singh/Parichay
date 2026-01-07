import {
  getActiveCoupons,
  createCoupon,
} from "../services/coupon.service.js";

// Get all active coupons
export const getCouponsController = async (req, res) => {
  try {
    const coupons = await getActiveCoupons();
    res.status(200).json({ coupons });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Create coupon (admin)
export const createCouponController = async (req, res) => {
  try {
    const coupon = await createCoupon(req.body);
    res.status(201).json({ coupon });
  } catch (error) {
    console.error("Error creating coupon:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
