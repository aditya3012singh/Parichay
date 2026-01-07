import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import Redis from "ioredis";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// Routes
import authRoutes from "./routes/auth.route.js";
import providerRoutes from "./routes/provider.route.js";
import availabilityRoutes from "./routes/availability.route.js";
import bookingRoutes from "./routes/booking.route.js";
import walletRoutes from "./routes/wallet.route.js";
import fileRoutes from "./routes/file.route.js";
import categoryRoutes from "./routes/category.route.js";
import couponRoutes from "./routes/coupon.route.js";
import reviewRoutes from "./routes/review.route.js";
import messageRoutes from "./routes/message.route.js";
import notificationRoutes from "./routes/notification.route.js";
import matchRoutes from "./routes/match.route.js";

// Socket handler
import { setupMatchingSocket } from "./socket/matchHandler.js";

// Middleware
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Redis & Prisma
const redis = new Redis(process.env.REDIS_URL);
const prisma = new PrismaClient();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory');
}

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  res.send("✅ UrbanCo-style API running");
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/provider", providerRoutes);
app.use("/api/v1/availability", availabilityRoutes);
app.use("/api/v1/booking", bookingRoutes);
app.use("/api/v1/wallet", walletRoutes);
app.use("/api/v1/files", fileRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/match", matchRoutes);

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler (must be last)
app.use(errorHandler);

// Socket.io setup
setupMatchingSocket(io);

// Redis connection check
redis.ping().then((res) => {
  console.log("🔁 Redis ping:", res);
}).catch((err) => {
  console.error("❌ Redis connection failed:", err);
});

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
