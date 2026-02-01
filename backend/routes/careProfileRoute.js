import express from "express";
import { createCareProfile, getCareProfiles } from "../controllers/careProfileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // Ensure all routes here are protected

router.post("/", createCareProfile);
router.get("/", getCareProfiles);

export default router;
