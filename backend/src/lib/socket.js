import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.on("join", ({ userId }) => {
      socket.join(userId); // Join room for user
    });

    socket.on("send_message", async ({ senderId, receiverId, content }) => {
      try {
        const message = await prisma.message.create({
          data: { senderId, receiverId, content },
        });

        io.to(receiverId).emit("receive_message", message);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}
