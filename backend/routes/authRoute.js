// routes/authRoute.js
import express from "express";
import jwt from "jsonwebtoken";
import {
  signup,
  validateLogin,
  forgotPassword,
  resetPassword
} from "../middleware/authMiddleware.js";


const router = express.Router();

// SIGNUP
router.post("/signup", signup);

// LOGIN
router.post("/login", validateLogin, (req, res) => {
  const token = jwt.sign(
    { userId: req.user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: {
      id: req.user._id,
      email: req.user.email,
    },
  });
});

// FORGOT PASSWORD (SEND OTP)
router.post("/forgot-password", forgotPassword);

// RESET PASSWORD
router.post("/reset-password", resetPassword);


export default router;

