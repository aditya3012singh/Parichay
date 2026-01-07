import {
  getProviderProfile,
  saveProviderProfile,
  getAllProviders,
  getProviderEarningsStats,
} from "../services/provider.service.js";

// Get current provider profile
export const getProfileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await getProviderProfile(userId);
    res.status(200).json({ profile });
  } catch (error) {
    console.error("Error fetching provider profile:", error);
    res.status(404).json({ message: error.message || "Provider profile not found" });
  }
};

// Save/Update provider profile
export const saveProfileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await saveProviderProfile(userId, req.body);
    res.status(200).json({ message: "Profile saved successfully", profile });
  } catch (error) {
    console.error("Error saving provider profile:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Get all providers
export const getAllProvidersController = async (req, res) => {
  try {
    const providers = await getAllProviders();
    res.status(200).json({ providers });
  } catch (error) {
    console.error("Error fetching providers:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// ✅ NEW: Get provider's earnings and statistics
export const getEarningsStatsController = async (req, res) => {
  try {
    const userId = req.user.id;
    const earnings = await getProviderEarningsStats(userId);
    res.status(200).json({ earnings });
  } catch (error) {
    console.error("Error fetching earnings stats:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
