import express from "express";
import {
  handleDequeueAllApplications,
  handleDequeueApplication,
} from "../controllers/queue.ctl";

const router = express.Router();

// ApplicationQueue
router.post("/dequeue-application", handleDequeueApplication);
router.post("/dequeue-all-applications", handleDequeueAllApplications);

export default router;
