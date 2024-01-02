import express from "express";
import { adminMiddleware } from "../middlewares/authMiddleware";
import { handleGetAllQueueApplications } from "../controllers/admin.ctl";
const router = express.Router();

router.get("/", adminMiddleware, handleGetAllQueueApplications);

export default router;
