import express from "express";
import {
  createMedication,
  getMedicationsByCareProfile,
  getMedicationById,
  updateMedication,
  deactivateMedication,
} from "../controllers/medicationController.js";

import upload from "../middleware/upload.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);

// Debug logging middleware
router.post("/", (req, res, next) => {
    console.log("POST /api/medications Hit");
    console.log("Headers:", req.headers['content-type']);
    next();
}, upload.single('image'), createMedication);
router.get("/care-profile/:careProfileId", getMedicationsByCareProfile);
router.get("/:id", getMedicationById);
router.put("/:id", updateMedication);
router.delete("/:id", deactivateMedication);

export default router;
