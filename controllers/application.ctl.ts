import asyncHandler from "express-async-handler";
import { CustomRequest } from "../types/CustomRequest";
import { createNewApplication } from "../services/Application/application.service";

const createApplicationHandler = asyncHandler(
  async (req: CustomRequest, res) => {
    const applicantId = req.applicant?._id?.toString();

    if (!applicantId) {
      throw new Error("Invalid applicantId");
    }

    const applicationData = req.body;

    // Merge applicantId into applicationData
    const mergedApplicationData = {
      ...applicationData,
      applicantId,
    };

    console.log(mergedApplicationData);

    try {
      const newApplication = await createNewApplication(
        mergedApplicationData,
        applicantId
      );

      res.json(newApplication);
    } catch (error) {
      throw new Error(error as string);
    }
  }
);

export { createApplicationHandler };
