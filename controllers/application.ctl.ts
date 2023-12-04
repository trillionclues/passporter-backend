import asyncHandler from "express-async-handler";
import { CustomRequest } from "../types/CustomRequest";
import { createNewApplication } from "../services/Application/application.service";
import Application from "../models/Applications/application.model";

const createApplicationHandler = asyncHandler(
  async (req: CustomRequest, res) => {
    const applicantId = req.applicant?._id?.toString();
    console.log(applicantId);
    if (!applicantId) {
      throw new Error("Invalid applicantId");
    }

    const applicationData = req.body;

    try {
      // Check if applicant already has an application of the same type
      const existingApplication = await Application.findOne({
        applicant: applicantId,
        applicationType: applicationData.applicationType
          .toString()
          .toLowerCase(),
      });

      if (existingApplication) {
        throw new Error("You already have an application of this type!");
      }

      // Merge applicantId into applicationData
      const mergedApplicationData = {
        ...applicationData,
        applicantId,
      };

      //  create new application
      const newApplication = await createNewApplication(
        mergedApplicationData,
        applicantId
      );

      res.json(newApplication);
    } catch (error: any) {
      // handle mongodb duplicate error
      if (
        error.name === "MongoServerError" &&
        error.code === 11000 &&
        error.keyPattern.applicationType
      ) {
        res
          .status(400)
          .send({ message: "You already have an application of this type!" });
      } else {
        throw new Error(error);
      }
    }
  }
);

export { createApplicationHandler };
