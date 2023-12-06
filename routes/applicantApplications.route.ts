import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import {
  createApplicationHandler,
  handleGetApplicantAplications,
} from "../controllers/application.ctl";
import { handleCancelApplication } from "../controllers/applicant.ctl";

const router = express.Router();

// application
router.post("/create-application", authMiddleware, createApplicationHandler);
router.get("/", authMiddleware, handleGetApplicantAplications);
router.post("/cancel-application", authMiddleware, handleCancelApplication);

export default router;
