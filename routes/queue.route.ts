import express from "express";
import { handleDequeueAllApplications } from "../controllers/queue.ctl";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// ApplicationQueue STAFF middleware
router.post("/dequeue-all-applications", handleDequeueAllApplications);

export default router;
