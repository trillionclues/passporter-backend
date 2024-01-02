import express from "express";
import { adminMiddleware } from "../middlewares/authMiddleware";
import {
  handleGetAllQueueApplications,
  handleGetRoleUpgradeRequests,
  handleProcessRoleUpgrade,
} from "../controllers/admin.ctl";
const router = express.Router();

router.get("/", adminMiddleware, handleGetAllQueueApplications);
router.get("/role-requests", adminMiddleware, handleGetRoleUpgradeRequests);

router.put(
  "/upgrade-applicant-role/:applicantId",
  adminMiddleware,
  handleProcessRoleUpgrade
);

export default router;
