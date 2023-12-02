import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import { createApplicationHandler } from "../controllers/application.ctl";

const router = express.Router();

// application
router.post("/create-application", authMiddleware, createApplicationHandler);

export default router;
