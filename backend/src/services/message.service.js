import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get messages between two users
export const getConversation = async (userId, receiverId) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId },
          { senderId: receiverId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

// Send message
export const sendMessage = async (senderId, receiverId, content) => {
  try {
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
    });

    return message;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
