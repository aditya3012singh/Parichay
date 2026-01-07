import {
  getUserNotifications,
  markNotificationAsRead,
} from "../services/notification.service.js";

// Get notifications
export const getNotificationsController = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await getUserNotifications(userId);
    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Mark as read
export const markAsReadController = async (req, res) => {
  try {
    const { id } = req.params;
    await markNotificationAsRead(id);
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
