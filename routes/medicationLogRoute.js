import express from "express";
import {
  upsertMedicationLog,
  getLogsByCareProfile,
  getLogsByMedication,
} from "../controllers/medicationLogController.js";

const router = express.Router();

// Mark taken / missed / skipped
router.post("/", upsertMedicationLog);

// Dashboard view
router.get(
  "/care-profile/:careProfileId",
  getLogsByCareProfile
);

// Trends per medication
router.get(
  "/medication/:medicationId",
  getLogsByMedication
);

export default router;
