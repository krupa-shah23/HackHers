import express from "express";
import {
  createMedication,
  getMedicationsByCareProfile,
  getMedicationById,
  updateMedication,
  deactivateMedication,
} from "../controllers/medicationController.js";

const router = express.Router();

router.post("/", createMedication);
router.get("/care-profile/:careProfileId", getMedicationsByCareProfile);
router.get("/:id", getMedicationById);
router.put("/:id", updateMedication);
router.delete("/:id", deactivateMedication);

export default router;
