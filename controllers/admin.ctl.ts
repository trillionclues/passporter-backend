import { CustomRequest } from "../types/CustomRequest";
import asyncHandler from "express-async-handler";
import { getAllQueueApplications } from "../services/Admin/admin.service";

const handleGetAllQueueApplications = asyncHandler(async (req, res) => {
  try {
    const applications = await getAllQueueApplications();
    res.json({ applications });
  } catch (error) {
    throw new Error(error as string);
  }
});

export { handleGetAllQueueApplications };
