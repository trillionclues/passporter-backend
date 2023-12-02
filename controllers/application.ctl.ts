import asyncHandler from "express-async-handler";
import { CustomRequest } from "../types/CustomRequest";
import { ApplicationDocument } from "../types/application.document";
import { createNewApplication } from "../services/Application/application.service";

const createApplicationHandler = asyncHandler(
  async (req: CustomRequest, res) => {
    const applicantId = req.applicant?._id?.toString();
    // console.log("Applicant ID:", applicantId);
    const applicationData: ApplicationDocument = req.body;

    try {
      const newApplication = await createNewApplication(
        applicantId,
        applicationData
      );

      res.json(newApplication);
    } catch (error) {
      throw new Error(error as string);
    }
  }
);

export { createApplicationHandler };
