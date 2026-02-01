// controllers/userController.js
import User from "../models/userModel.js";

export const getMe = async (req, res) => {
  try {
    // Ensure req.user exists (protected route)
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }
    res.json(req.user); // req.user is already fetched by protect middleware
  } catch (error) {
    console.error("getMe Error:", error);
    res.status(500).json({ message: "Server Error in getMe", error: error.message });
  }
};

export const updateMe = async (req, res) => {
  try {
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id, // Fix: use req.user._id
        req.body,
        { new: true }
      ).select("-password");

      res.json(updatedUser);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
