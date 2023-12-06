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

      // get the applicantID and his applications with application type of either Passport and Visa applicationType and compare if tthe applicant has more than one application running at a time...
      const applicant = await Application.findOne({
        applicantId: applicantId,
        $or: [{ applicationType: "Passport" }, { applicationType: "Visa" }],
      });

      if (applicant) {
        throw new Error("Applicant already has a passport or visa application");
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
