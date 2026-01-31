import express from "express";
import { createCareProfile } from "../controllers/careProfileController.js";

const router = express.Router();

router.post("/", createCareProfile);

export default router;
