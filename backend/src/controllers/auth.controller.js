import {
  generateOTP,
  verifyOTP,
  checkUserExists,
  checkAdminExists,
  signupUser,
  signinUser,
  getCurrentUser,
  getAllUsers,
  updateUserProfile,
  deleteUser,
} from "../services/auth.service.js";

// Generate OTP
export const generateOTPController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    await generateOTP(email);
    res.json({ message: "OTP sent to email!" });
  } catch (error) {
    console.error("OTP error:", error);
    res.status(500).json({ message: error.message || "Failed to send OTP" });
  }
};

// Verify OTP
export const verifyOTPController = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required" });
    }

    await verifyOTP(email, code);
    res.json({ message: "OTP verified. You can now sign up." });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(400).json({ message: error.message || "OTP verification failed" });
  }
};

// Check admin exists
export const checkAdminController = async (req, res) => {
  try {
    const adminExists = await checkAdminExists();
    const adminCount = adminExists ? 1 : 0;

    res.status(200).json({
      adminExists,
      adminCount,
    });
  } catch (error) {
    console.error("Error checking admin existence:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Check user exists
export const checkUserController = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const exists = await checkUserExists(email);
    res.status(200).json({ exists });
  } catch (error) {
    console.error("Error checking user existence:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Signup
export const signupController = async (req, res) => {
  try {
    const result = await signupUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({ message: error.message || "Signup failed" });
  }
};

// Signin
export const signinController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const result = await signinUser(email, password);
    res.json({
      message: "Login successful",
      jwt: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(400).json({ message: error.message || "Login failed" });
  }
};

// Get current user
export const getMeController = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await getCurrentUser(userId);
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(404).json({ message: error.message || "User not found" });
  }
};

// Get all users (admin)
export const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update profile
export const updateProfileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await updateUserProfile(userId, req.body);
    res.status(200).json({ message: "Profile updated", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Delete user (admin)
export const deleteUserController = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    await deleteUser(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
