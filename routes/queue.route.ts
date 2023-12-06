import express from "express";
import {
  handleDequeueAllApplications,
  handleDequeueApplication,
} from "../controllers/queue.ctl";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// ApplicationQueue
router.post("/dequeue-application", authMiddleware, handleDequeueApplication);
router.post("/dequeue-all-applications", handleDequeueAllApplications);

export default router;
