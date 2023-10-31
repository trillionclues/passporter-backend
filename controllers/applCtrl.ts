import asyncHandler from "express-async-handler";
import {
  applicantLogin,
  createNewApplicant,
  getApplicant,
  getApplicants,
} from "../services/Applicant/applService";
import { generateToken } from "../utils/jwtToken";

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

const getOneApplicant = asyncHandler(async (req, res) => {
  const applicantId = req.params;
  //   console.log(applicantId);
  try {
    const getOneApplicant = await getApplicant(applicantId);
    res.json({ getOneApplicant });
  } catch (error) {
    throw new Error(error as string);
  }
});

const handleApplicantLogin = asyncHandler(async (req, res) => {
  try {
    const applicant = await applicantLogin(req.body);

    res.cookie("refreshToken", applicant.refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000, // 72hrs
    });

    res.json({
      _id: applicant._id,
      firstname: applicant.firstname,
      lastname: applicant.lastname,
      token: generateToken(applicant._id),
    });
  } catch (error) {
    throw new Error(error as string);
  }
});

export {
  createApplicant,
  getAllApplicants,
  getOneApplicant,
  handleApplicantLogin,
};
