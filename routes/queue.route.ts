import express from "express";
import { handleDequeueApplication } from "../controllers/queue.ctl";

const router = express.Router();

// ApplicationQueue
router.post("/dequeue-application", handleDequeueApplication);

export default router;
