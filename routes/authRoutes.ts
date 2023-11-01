import express from "express";

import {
  createApplicant,
  handleGetAllApplicants,
  handleGetOneApplicant,
  handleApplicantLogin,
  handleDeleteApplicant,
  handleUpdateApplicant,
  handleTokenRefresh,
  handleApplicantLogout,
} from "../controllers/applCtrl";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// applicant
router.post("/register", createApplicant);
router.get("/", handleGetAllApplicants);
router.post("/auth/login", handleApplicantLogin);

// specifics
router.get("/refresh", handleTokenRefresh);
router.get("/auth/logout", handleApplicantLogout);

// dynamic routes
router.delete("/:id", handleDeleteApplicant);
router.put("/update-user", authMiddleware, handleUpdateApplicant);
router.get("/:id", authMiddleware, handleGetOneApplicant);

export default router;
