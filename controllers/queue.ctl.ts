import asyncHandler from "express-async-handler";
import { dequeueApplication } from "../services/Application Queue/applicationQueue. service";
import Application from "../models/Applications/application.model";

const handleDequeueApplication = asyncHandler(async (req, res) => {
  const applicationId = req.body.applicationId;

  try {
    // check if the provided applicationId matches a valid application _id in the database
    const applicationExists = await Application.exists({ _id: applicationId });

    if (!applicationExists) {
      throw new Error(`Invalid application ID: ${applicationId}`);
    }

    const result = await dequeueApplication(applicationId);
    res.json(result);
  } catch (error) {
    throw new Error(error as string);
  }
});

export { handleDequeueApplication };
