import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoute.js";
import careProfileRoutes from "./routes/careProfileRoute.js";
import medicationRoute from "./routes/medicationRoute.js";
import medicationLogRoute from "./routes/medicationLogRoute.js";
import refillRoute from "./routes/refillRoute.js";
import pharmacyRoute from "./routes/pharmacyRoute.js";
import dailyCheckInRoute from "./routes/dailyCheckInRoute.js";
import logger from "./middleware/logger.js";
import authRoutes from "./routes/authRoute.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


app.use(logger);

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/care-profiles", careProfileRoutes);

app.use("/api/medications", medicationRoute);

app.use("/api/medication-logs", medicationLogRoute);

app.use("/api/refills", refillRoute);

app.use("/api/pharmacies", pharmacyRoute);

app.use("/api/daily-checkins", dailyCheckInRoute);

import insightsRoutes from "./routes/insightsRoute.js";
app.use("/api/insights", insightsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err);
    res.status(500).json({ message: "Server Error", error: err.message || err });
});


app.listen(5000, () => {
  console.log("Server running on port 5000 (DEBUG MODE)");
});
