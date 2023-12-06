import asyncHandler from "express-async-handler";
import { dequeueApplication } from "../services/Application Queue/applicationQueue. service";
import { CustomRequest } from "../types/CustomRequest";

const handleDequeueApplication = asyncHandler(async (req, res) => {
  const applicationId = req.body.applicationId;

  try {
    const result = await dequeueApplication(applicationId);
    res.json(result);
  } catch (error) {
    throw new Error(error as string);
  }
});

export { handleDequeueApplication };
