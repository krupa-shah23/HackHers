// routes/userRoute.js
import express from "express";
import { getMe, updateMe } from "../controllers/userController.js";
import verifyJWT from "../middleware/jwt.js";

const router = express.Router();

router.get("/me", verifyJWT, getMe);
router.patch("/me", verifyJWT, updateMe);

export default router;
