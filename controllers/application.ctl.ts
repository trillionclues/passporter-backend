import asyncHandler from "express-async-handler";
import { CustomRequest } from "../types/CustomRequest";
import {
  createNewApplication,
  getApplicantApplications,
} from "../services/Application/application.service";
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

      // If previous application is pending or processing, cannot create a new application. If application is calcelled or rejected or no current applicaition, can create a new application.

      const previousApplication = await Application.findOne({
        applicantId: applicantId,
        $or: [{ applicationType: "Passport" }, { applicationType: "Visa" }],
      });

      if (
        previousApplication &&
        previousApplication.queueStatus === "Pending"
      ) {
        throw new Error("You already have a pending application");
      } else if (
        previousApplication &&
        previousApplication.queueStatus === "Processing"
      ) {
        throw new Error("You already have a processing application");
      } else if (
        previousApplication &&
        previousApplication.queueStatus !== "Cancelled"
      ) {
        throw new Error("You cannot create a new application");
      } else if (
        previousApplication &&
        previousApplication.queueStatus !== "Cancelled"
      ) {
        throw new Error("You cannot create a new application");
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

// Application Controller
const handleGetApplicantAplications = asyncHandler(
  async (req: CustomRequest, res) => {
    const applicantId = req.applicant?._id?.toString();

    try {
      const applications = await getApplicantApplications(applicantId);
      res.status(200).json(applications);
    } catch (error: any) {
      res.status(500).json({ error: error?.message });
    }
  }
);

export { createApplicationHandler, handleGetApplicantAplications };
