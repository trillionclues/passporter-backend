import asyncHandler from "express-async-handler";
import { CustomRequest } from "../types/CustomRequest";
import { createNewApplication } from "../services/Application/application.service";
import Application from "../models/Applications/application.model";

const createApplicationHandler = asyncHandler(
  async (req: CustomRequest, res) => {
    const applicantId = req.applicant?._id?.toString();

    if (!applicantId) {
      throw new Error("Invalid applicantId");
    }

    try {
      const applicationData = req.body;
      const mergedApplicationData = { ...applicationData, applicantId };

      const applicantExists = await Application.exists({
        applicantId: mergedApplicationData.applicantId,
      });

      const typeExists = await Application.exists({
        applicationType: mergedApplicationData.applicationType.toLowerCase(),
      });

      if (applicantExists && typeExists) {
        throw new Error("An aplication of this type already exists!");
      }

      //  create new application
      const newApplication = await createNewApplication(
        mergedApplicationData,
        applicantId
      );

      res.status(201).send(newApplication);
    } catch (error: any) {
      throw new Error("Error creating application: " + error.message);
    }
  }
);

export { createApplicationHandler };
