import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoute.js";
import careProfileRoutes from "./routes/careProfileRoute.js";
import medicationRoute from "./routes/medicationRoute.js";
import medicationLogRoute from "./routes/medicationLogRoute.js";
import refillRoute from "./routes/refillRoute.js";
import dailyCheckInRoute from "./routes/dailyCheckInRoute.js";
import logger from "./middleware/logger.js";
import authRoutes from "./routes/authRoute.js";



const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


app.use(logger);

app.use("/api/auth", authRoutes);

app.use("/users", userRoutes);

app.use("/care-profiles", careProfileRoutes);

app.use("/api/medications", medicationRoute);

app.use("/api/medication-logs", medicationLogRoute);

app.use("/api/refills", refillRoute);

app.use("/api/daily-checkins", dailyCheckInRoute);


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
