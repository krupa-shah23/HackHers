import express from "express";
import {
    getNearbyPharmacies,
    requestRefill,
    getRefillStatus,
    toggleAutoRefill,
    seedPharmacies
} from "../controllers/pharmacyController.js";

const router = express.Router();

// Get nearby pharmacies (with optional medication filter)
router.get("/nearby", getNearbyPharmacies);

// Request a refill
router.post("/request", requestRefill);

// Get refill status for a medication
router.get("/status/:medicationId", getRefillStatus);

// Toggle auto-refill
router.put("/auto-refill/:medicationId", toggleAutoRefill);

// Seed demo pharmacies (development only)
router.post("/seed", seedPharmacies);

export default router;
