import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL);

// ✅ Nodemailer setup
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// OTP HTML Template
export const otpHtmlTemplate = (otp) => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2 style="color: #007bff;">🔐 Your Verification Code</h2>
    <p>Use the following OTP to verify your identity:</p>
    <h1 style="letter-spacing: 4px; color: #222;">${otp}</h1>
    <p>This code will expire in 10 minutes.</p>
    <br/>
    <p>Thank you,<br/><strong>SewaSetu Team</strong></p>
  </div>
`;

// Generate and send OTP
export const generateOTP = async (email) => {
  try {
    const normalizedEmail = email.toLowerCase();
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in Redis with 10-minute TTL
    await redis.set(`otp:${normalizedEmail}`, otpCode, "EX", 600);

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: normalizedEmail,
      subject: "Your OTP Code",
      html: otpHtmlTemplate(otpCode),
      text: `Your verification code is ${otpCode}`,
    });

    return { success: true, message: "OTP sent to email" };
  } catch (error) {
    console.error("OTP generation error:", error);
    throw new Error("Failed to send OTP");
  }
};

// Verify OTP
export const verifyOTP = async (email, code) => {
  try {
    const normalizedEmail = email.toLowerCase();
    const storedOtp = await redis.get(`otp:${normalizedEmail}`);

    if (!storedOtp || storedOtp !== code) {
      throw new Error("Invalid or expired OTP");
    }

    // Clear OTP and set verification flag
    await redis.del(`otp:${normalizedEmail}`);
    await redis.set(`verified:${normalizedEmail}`, "true", "EX", 600);

    return { success: true, message: "OTP verified" };
  } catch (error) {
    console.error("OTP verification error:", error);
    throw error;
  }
};

// Check if user exists
export const checkUserExists = async (email) => {
  try {
    const normalizedEmail = email.toLowerCase();
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    return !!existingUser;
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw error;
  }
};

// Check if admin exists
export const checkAdminExists = async () => {
  try {
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" },
    });

    return adminCount > 0;
  } catch (error) {
    console.error("Error checking admin existence:", error);
    throw error;
  }
};

// Signup user
export const signupUser = async (userData) => {
  const { email: rawEmail, name, password, phone, role } = userData;
  const email = rawEmail.toLowerCase();

  try {
    // Check if email is verified via OTP
    const isVerified = await redis.get(`verified:${email}`);
    if (!isVerified) {
      throw new Error("Please verify your email via OTP before signing up.");
    }

    // Check if only one admin allowed
    if (role === "ADMIN") {
      const adminCount = await prisma.user.count({
        where: { role: "ADMIN" },
      });

      if (adminCount > 0) {
        throw new Error("Admin already exists. Only one admin is allowed per system.");
      }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
        role: role ?? "USER",
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    // Clear verification flag
    await redis.del(`verified:${email}`);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

// Signin user
export const signinUser = async (email, password) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Incorrect password");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    const { password: _, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword,
    };
  } catch (error) {
    console.error("Signin error:", error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

// Get all users (admin)
export const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    const { name, password } = profileData;
    const updateData = {};

    if (name) updateData.name = name;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

// Delete user (admin)
export const deleteUser = async (userId) => {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    return { message: "User deleted successfully" };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
