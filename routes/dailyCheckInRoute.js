import express from "express";
import {
  upsertDailyCheckIn,
  getCheckInsByCareProfile,
} from "../controllers/dailyCheckInController.js";

const router = express.Router();

// One emoji tap
router.post("/", upsertDailyCheckIn);

// Mood history
router.get(
  "/care-profile/:careProfileId",
  getCheckInsByCareProfile
);

export default router;
