import express from "express";

import {
  createApplicant,
  handleGetAllApplicants,
  handleGetOneApplicant,
  handleApplicantLogin,
  handleDeleteApplicant,
  handleUpdateApplicant,
} from "../controllers/applCtrl";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();
router.post("/auth/register", createApplicant);
router.get("/", handleGetAllApplicants);
router.delete("/:id", handleDeleteApplicant);

// dynamic routes
router.get("/:id", authMiddleware, handleGetOneApplicant);
router.post("/auth/login", handleApplicantLogin);
router.put("/update-user", authMiddleware, handleUpdateApplicant);

export default router;
