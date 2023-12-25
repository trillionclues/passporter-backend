import asyncHandler from "express-async-handler";
import {
  applicantLogin,
  createNewApplicant,
  getOneApplicant,
  getAllApplicants,
  tokenRefresh,
  logoutApplicant,
  sendPasswordResetToken,
  passwordResetLinkWithToken,
  cancelApplication,
  updateProfile,
  requestRoleUpgrade,
  deleteAccount,
} from "../services/Applicant/applicant.service";
import { CustomRequest } from "../types/CustomRequest";
import Application from "../models/Applications/application.model";

const createApplicant = asyncHandler(async (req, res) => {
  try {
    const applicantData = req.body;
    const newApplicant = await createNewApplicant(applicantData);
    res.json(newApplicant);
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
  try {
    const getApplicant = await getOneApplicant(applicantId);
    res.json({ getApplicant });
  } catch (error) {
    throw new Error(error as string);
  }
});

// Applicant Controller Auth
const handleApplicantLogin = asyncHandler(async (req, res) => {
  try {
    const applicant = await applicantLogin(req.body);

    res.cookie("refreshToken", applicant.refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000, // 72hrs
    });

    res.json(applicant);
  } catch (error) {
    throw new Error(error as string);
  }
});

const handleTokenRefresh = asyncHandler(async (req, res) => {
  try {
    const cookie = req.cookies;

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

const handleDeleteAccount = asyncHandler(async (req: CustomRequest, res) => {
  const applicantId = req.applicant?._id?.toString();
  try {
    const result = await deleteAccount(applicantId);
    res.json(result);
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

// Update Profile
const handleUpdateApplicant = asyncHandler(async (req: CustomRequest, res) => {
  try {
    const data = req.body;
    const applicantId = req.applicant?._id?.toString();

    const updated = await updateProfile(data, applicantId);
    res.status(200).send(updated);
  } catch (error) {
    throw new Error(error as string);
  }
});

const handleCancelApplication = asyncHandler(
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

      const result = await cancelApplication(application._id);

      res.json(result);
    } catch (error) {
      throw new Error(error as string);
    }
  }
);

const handleRequestRoleUpgrade = asyncHandler(
  async (req: CustomRequest, res) => {
    const applicantId = req.applicant?._id?.toString();
    try {
      const result = requestRoleUpgrade(applicantId);
      res.json(result);
    } catch (error) {
      throw new Error(error as string);
    }
  }
);

// const hnupdateProfilePicture = asyncHandler(async (req: CustomRequest, res) => {

// })

export {
  createApplicant,
  handleGetAllApplicants,
  handleGetOneApplicant,
  handleApplicantLogin,
  handleUpdateApplicant,
  handleTokenRefresh,
  handleApplicantLogout,
  handleSendPasswordResetToken,
  handleResetLinkWithToken,
  handleCancelApplication,
  handleRequestRoleUpgrade,
  handleDeleteAccount,
};
