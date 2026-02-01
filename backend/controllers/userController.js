// controllers/userController.js
import User from "../models/userModel.js";

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("getMe Error:", error);
    res.status(500).json({ message: "Server Error in getMe", error: error.message });
  }
};

export const updateMe = async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.userId,
    req.body,
    { new: true }
  ).select("-password");

  res.json(updatedUser);
};
