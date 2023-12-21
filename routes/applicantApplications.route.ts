import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import {
  createApplicationHandler,
  handleGetApplicantAplications,
  handleGetSingleApplication,
} from "../controllers/application.ctl";
import { handleCancelApplication } from "../controllers/applicant.ctl";
import {
  createCommentHandler,
  getAllCommentsForApplicationHandler,
} from "../controllers/comment.ctl";

const router = express.Router();

// application
router.post("/create-application", authMiddleware, createApplicationHandler);
router.get("/", authMiddleware, handleGetApplicantAplications);
router.post("/cancel-application", authMiddleware, handleCancelApplication);

// comments
router.post(
  "/comments/add-applicant-comment",
  authMiddleware,
  createCommentHandler
);

router.get("/:appId", handleGetSingleApplication);
router.get("/comments/:applicationId", getAllCommentsForApplicationHandler);

export default router;
