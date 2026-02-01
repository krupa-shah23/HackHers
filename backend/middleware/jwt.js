import jwt from "jsonwebtoken";

import User from "../models/userModel.js";

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "Authorization header missing" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.userId = decoded.userId; // Legacy
    
    // Attach full user object
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    
    req.user = user;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    res.status(401).json({ message: "Invalid or expired token", error: err.message });
  }
};

export default verifyJWT;
