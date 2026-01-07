import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create availability slot
export const createAvailabilitySlot = async (providerId, slotData) => {
  try {
    const slot = await prisma.availabilitySlot.create({
      data: {
        providerId,
        ...slotData,
      },
    });

    return slot;
  } catch (error) {
    console.error("Error creating slot:", error);
    throw error;
  }
};

// Get provider's slots
export const getProviderSlots = async (providerId) => {
  try {
    const slots = await prisma.availabilitySlot.findMany({
      where: { providerId },
      orderBy: { startTime: "asc" },
    });

    return slots;
  } catch (error) {
    console.error("Error fetching slots:", error);
    throw error;
  }
};

// Delete slot
export const deleteSlot = async (slotId, providerId) => {
  try {
    const slot = await prisma.availabilitySlot.findUnique({
      where: { id: slotId },
    });

    if (!slot || slot.providerId !== providerId) {
      throw new Error("Slot not found or unauthorized");
    }

    await prisma.availabilitySlot.delete({ where: { id: slotId } });

    return { message: "Slot deleted" };
  } catch (error) {
    console.error("Error deleting slot:", error);
    throw error;
  }
};
