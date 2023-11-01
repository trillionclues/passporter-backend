import asyncHandler from "express-async-handler";
import {
  applicantLogin,
  createNewApplicant,
  deleteApplicant,
  getOneApplicant,
  getAllApplicants,
  updateApplicant,
  tokenRefresh,
  logoutApplicant,
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

const handleTokenRefresh = asyncHandler(async (req, res) => {
  try {
    const cookie = req.cookies;
    // console.log(cookie);

    if (!cookie?.refreshToken)
      throw new Error("No refresh token found in cookie!");
    const refreshToken = cookie.refreshToken;
    const result = await tokenRefresh(refreshToken);

    res.json({ result });
  } catch (error) {
    throw new Error(error as string);
  }
});

const handleApplicantLogout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  try {
    const result = await logoutApplicant(refreshToken);
    if (result.success) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      res.json({ message: result.message });
    } else {
      res.status(400).json({ error: result.message });
    }
  } catch (error) {
    throw new Error(error as string);
  }
});

const handleGetAllApplicants = asyncHandler(async (req, res) => {
  try {
    const applicants = await getAllApplicants();
    res.json(applicants);
  } catch (error) {
    throw new Error(error as string);
  }
});

const handleGetOneApplicant = asyncHandler(async (req, res) => {
  const applicantId = req.params;
  //   console.log(applicantId);
  try {
    const getApplicant = await getOneApplicant(applicantId);
    res.json({ getApplicant });
  } catch (error) {
    throw new Error(error as string);
  }
});

const handleDeleteApplicant = asyncHandler(async (req, res) => {
  const applicantId = req.params;

  try {
    const deleted = await deleteApplicant(applicantId);
    res.json({ deleted });
  } catch (error) {
    throw new Error(error as string);
  }
});

const handleUpdateApplicant = asyncHandler(async (req, res) => {
  try {
    const data = req.body;
    const updated = await updateApplicant(data);
    res.json(updated);
  } catch (error) {
    throw new Error(error as string);
  }
});

export {
  createApplicant,
  handleGetAllApplicants,
  handleGetOneApplicant,
  handleApplicantLogin,
  handleDeleteApplicant,
  handleUpdateApplicant,
  handleTokenRefresh,
  handleApplicantLogout,
};
