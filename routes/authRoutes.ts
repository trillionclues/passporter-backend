import express from "express";

import { createApplicant, getAllApplicants } from "../controllers/applCtrl";

const router = express.Router();
router.post("/auth/register", createApplicant);
router.get("/auth/applicants", getAllApplicants);

export default router;
