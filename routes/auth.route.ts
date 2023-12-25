import express from "express";

import {
  createApplicant,
  handleGetAllApplicants,
  handleGetOneApplicant,
  handleApplicantLogin,
  handleUpdateApplicant,
  handleTokenRefresh,
  handleApplicantLogout,
  handleSendPasswordResetToken,
  handleResetLinkWithToken,
  handleRequestRoleUpgrade,
  handleDeleteAccount,
} from "../controllers/applicant.ctl";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// applicant
router.post("/register", createApplicant);
router.get("/", handleGetAllApplicants);
router.post("/auth/login", handleApplicantLogin);
router.post("/auth/reset-password/send-token", handleSendPasswordResetToken);
router.post("/role-request-upgrade", authMiddleware, handleRequestRoleUpgrade);
router.put("/auth/reset-password/:token", handleResetLinkWithToken);

// specifics
router.get("/refresh", handleTokenRefresh);
router.get("/auth/logout", handleApplicantLogout);

// dynamic routes
router.delete("/delete-account", authMiddleware, handleDeleteAccount);
router.put("/update-user", authMiddleware, handleUpdateApplicant);
router.get("/:id", authMiddleware, handleGetOneApplicant);

export default router;
