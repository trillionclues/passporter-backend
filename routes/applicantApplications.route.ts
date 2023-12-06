import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import {
  createApplicationHandler,
  handleGetApplicantAplications,
} from "../controllers/application.ctl";

const router = express.Router();

// application
router.post("/create-application", authMiddleware, createApplicationHandler);
router.get("/", authMiddleware, handleGetApplicantAplications);

export default router;
