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
  sendPasswordResetToken,
  passwordResetLinkWithToken,
} from "../services/Applicant/applicant.service";
import { generateToken } from "../utils/jwtToken";
import { StringExpressionOperatorReturningString } from "mongoose";

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
      ...applicant,
      // _id: applicant._id,
      // firstname: applicant.firstname,
      // lastname: applicant.lastname,
      // token: generateToken(applicant._id),
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
    const { email } = req.body;
    const updated = await updateApplicant({ email });
    res.json(updated);
  } catch (error) {
    throw new Error(error as string);
  }
});

const handleSendPasswordResetToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const result = await sendPasswordResetToken(email);
    res.json(result);
  } catch (error) {
    throw new Error(error as string);
  }
});

const handleResetLinkWithToken = asyncHandler(async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { token } = req.params;
    const result = await passwordResetLinkWithToken(token, newPassword);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    throw new Error(error);
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
  handleSendPasswordResetToken,
  handleResetLinkWithToken,
};
