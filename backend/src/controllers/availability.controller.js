import {
  createAvailabilitySlot,
  getProviderSlots,
  deleteSlot,
} from "../services/availability.service.js";

// Create slot
export const createSlotController = async (req, res) => {
  try {
    const providerId = req.user.id;
    const slot = await createAvailabilitySlot(providerId, req.body);
    res.status(201).json({ message: "Slot created", slot });
  } catch (error) {
    console.error("Error creating slot:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Get slots
export const getSlotsController = async (req, res) => {
  try {
    const providerId = req.user.id;
    const slots = await getProviderSlots(providerId);
    res.status(200).json({ slots });
  } catch (error) {
    console.error("Error fetching slots:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Delete slot
export const deleteSlotController = async (req, res) => {
  try {
    const { slotId } = req.params;
    const providerId = req.user.id;

    await deleteSlot(slotId, providerId);
    res.status(200).json({ message: "Slot deleted" });
  } catch (error) {
    console.error("Error deleting slot:", error);
    res.status(400).json({ message: error.message || "Internal server error" });
  }
};
