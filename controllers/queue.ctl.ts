import asyncHandler from "express-async-handler";
import {
  dequeueAllApplications,
  dequeueApplication,
} from "../services/Application Queue/applicationQueue. service";
import Application from "../models/Applications/application.model";
import { CustomRequest } from "../types/CustomRequest";

const handleDequeueApplication = asyncHandler(
  async (req: CustomRequest, res) => {
    const applicant = req.applicant?._id?.toString();

    try {
      // find applicationId with applicant
      const application = await Application.findOne({
        applicantId: applicant,
        $or: [{ applicationType: "Passport" }, { applicationType: "Visa" }],
      });

      if (!application) {
        throw new Error("No application found for the applicant");
      }

      const result = await dequeueApplication(application._id);

      res.json(result);
    } catch (error) {
      throw new Error(error as string);
    }
  }
);

const handleDequeueAllApplications = asyncHandler(async (req, res) => {
  try {
    const result = await dequeueAllApplications();
    res.json(result);
  } catch (error) {
    throw new Error(error as string);
  }
});

export { handleDequeueApplication, handleDequeueAllApplications };
