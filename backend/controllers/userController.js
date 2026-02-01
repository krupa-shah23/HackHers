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

import fs from 'fs';

export const updateMe = async (req, res) => {
  const logPath = "C:\\Users\\DELL\\.gemini\\antigravity\\brain\\786461ef-c8bc-4096-9f59-51fdc512db41\\backend_debug.log";
  const log = (msg) => {
    try { fs.appendFileSync(logPath, `${new Date().toISOString()}: ${msg}\n`); } catch(e){}
  };

  try {
      log("updateMe called");
      log(`req.userId (from token): ${req.userId}`); // Check if legacy field is there
      log(`req.user: ${JSON.stringify(req.user)}`);
      log(`req.body: ${JSON.stringify(req.body)}`);

      if (!req.user || !req.user._id) {
        log("ERROR: User ID not found in request");
        throw new Error("User ID not found in request");
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user._id, 
        req.body,
        { new: true, runValidators: true }
      ).select("-password");

      log("Update success");
      res.json(updatedUser);
  } catch (error) {
      log(`CRITICAL ERROR: ${error.stack}`);
      console.error("updateMe Error:", error);
      res.status(500).json({ message: error.message });
  }
};
