import express from "express";
import {
  upsertRefill,
  getRefillByMedication,
  updateDaysRemaining,
} from "../controllers/refillController.js";

const router = express.Router();

// Create / update refill
router.post("/", upsertRefill);

// Get refill info for a medication
router.get(
  "/medication/:medicationId",
  getRefillByMedication
);

// Update remaining days
router.put(
  "/medication/:medicationId",
  updateDaysRemaining
);

export default router;
