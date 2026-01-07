import {
  getConversation,
  sendMessage,
} from "../services/message.service.js";

// Get conversation
export const getConversationController = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const userId = req.user.id;

    const messages = await getConversation(userId, receiverId);
    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Send message
export const sendMessageController = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ message: "Receiver ID and content are required" });
    }

    const message = await sendMessage(senderId, receiverId, content);
    res.status(201).json({ message });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
