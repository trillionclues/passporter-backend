import express from "express";

import {
  createApplicant,
  getAllApplicants,
  getOneApplicant,
  handleApplicantLogin,
} from "../controllers/applCtrl";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();
router.post("/auth/register", createApplicant);
router.get("/", getAllApplicants);

// dynamic routes
router.get("/:id", authMiddleware, getOneApplicant);
router.post("/auth/login", handleApplicantLogin);

export default router;
