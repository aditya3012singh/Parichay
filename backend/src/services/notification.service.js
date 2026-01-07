import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get user notifications
export const getUserNotifications = async (userId) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    return { message: "Notification marked as read" };
  } catch (error) {
    console.error("Error updating notification:", error);
    throw error;
  }
};

// Create notification
export const createNotification = async (userId, message, type) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        message,
        type,
      },
    });

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};
