import asyncHandler from "express-async-handler";
import {
  createNewApplicant,
  getApplicants,
} from "../services/Applicant/ApplService";

const createApplicant = asyncHandler(async (req, res) => {
  try {
    const applicantData = req.body;
    const newApplicant = await createNewApplicant(applicantData);
    res.json(newApplicant);
  } catch (error) {
    throw new Error(error as string);
  }
});

const getAllApplicants = asyncHandler(async (req, res) => {
  try {
    const applicants = await getApplicants();
    res.json(applicants);
  } catch (error) {
    throw new Error(error as string);
  }
});

export { createApplicant, getAllApplicants };
