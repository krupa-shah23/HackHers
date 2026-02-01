import express from "express";
import {
    getInsights,
    acceptInsight,
    dismissInsight,
    analyzePatterns,
    getRiskScore
} from "../controllers/insightsController.js";
import { calculateAdherenceScore, getRiskLevel } from "../utils/riskEngine.js";

const router = express.Router();

// Get pending insights for a user
router.get("/:userId", getInsights);

// Accept a suggestion
router.post("/accept/:insightId", acceptInsight);

// Dismiss an insight
router.post("/dismiss/:insightId", dismissInsight);

// Analyze patterns (trigger manually or via cron)
router.post("/analyze/:userId", analyzePatterns);

// Get Adherence Risk Score (ML)
router.get("/risk-score/:userId", getRiskScore);

export default router;
