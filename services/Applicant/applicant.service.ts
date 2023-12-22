import { ParamsDictionary } from "express-serve-static-core";
import Applicant from "../../models/ApplicantModel/applicant.model";
import Application from "../../models/Applications/application.model";
import { validateMongoDBId } from "../../utils/validateMongoDBId";
import { generateRefreshToken } from "../../utils/generateRefreshToken";
import { generateToken } from "../../utils/jwtToken";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ApplicantDocument } from "../../types/applicant.document";
import generateEmailBody from "../../views/emailBody";
import { sendCustomEmail } from "../Email/email.service";
import { faker } from "@faker-js/faker";
import ApplicationQueue from "../../models/Application Queue/applicationqueue.model";

const createNewApplicant = async (body: ApplicantDocument) => {
  const { email, password, firstname, lastname } = body;

  const findApplicant = await Applicant.findOne({ email: email });

  if (!findApplicant) {
    const newApplicant = await Applicant.create({
      email,
      password,
      firstname,
      lastname,
    });
    return newApplicant;
  } else {
    throw new Error("Applicant already exists");
  }
};

const getAllApplicants = async () => {
  const applicant = await Applicant.find();
  return applicant;
};

const getOneApplicant = async (data: ParamsDictionary) => {
  const { id } = data;
  validateMongoDBId(id);

  const getApp = await Applicant.findById(id);
  return getApp;
};

// Applicant Service Auth
const applicantLogin = async (data: { email: string; password: string }) => {
  const { email, password } = data;

  const findApplicant = await Applicant.findOne({ email });
  const applicantId = findApplicant?._id;

  if (findApplicant && (await findApplicant.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findApplicant?._id);
    const updatedApplicant = await Applicant.findByIdAndUpdate(
      findApplicant?._id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );

    // get profile picture
    let profilePicture: any;

    if (findApplicant.profilePicture) {
      profilePicture = findApplicant?.profilePicture;
    } else {
      const randomImageUrl = faker.image.avatarGitHub();
      profilePicture = randomImageUrl;
    }

    return {
      profilePicture,
      token: generateToken(applicantId),
      refreshToken,
    };
  } else {
    throw new Error("Invalid credentials!");
  }
};

const tokenRefresh = async (refreshToken: any) => {
  const findApplicant = await Applicant.findOne({ refreshToken });
  if (!findApplicant) throw new Error("No refresh token found in DB");

  // Verify token with jwt
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) throw new Error("Wrong JWT secret code");

  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, JWT_SECRET, async (err: any, decoded: any) => {
      if (err || findApplicant.id !== decoded?.id) {
        reject("There is something wrong with the refresh token!");
      }

      // Generate a new access token
      const accessToken = await generateToken(findApplicant._id);
      resolve({ accessToken });
    });
  });
};

const logoutApplicant = async (refreshToken: any) => {
  if (!refreshToken) {
    return { success: true };
  }

  // ...find exact user and clear cookie
  const updatedResult = await Applicant.findOneAndUpdate(
    { refreshToken },
    { refreshToken: "" }
  );

  if (updatedResult) {
    return { success: true, message: "Applicant successfully logged out!" };
  } else {
    return { success: false, message: "Logout failed" };
  }
};

const sendPasswordResetToken = async (email: string) => {
  const applicant: ApplicantDocument | null = await Applicant.findOne({
    email,
  });
  if (!applicant) {
    throw new Error("Applicant not found!");
  }
  const resetToken = await applicant.createPasswordResetToken();
  await applicant.save();

  // reset password url
  const buttonText = "Reset Password";
  const emailBody = generateEmailBody(
    resetToken,
    buttonText,
    applicant.firstname
  );

  const data = {
    to: email,
    subject: "Reset Password",
    htm: emailBody,
  };

  // send the email with data obj
  sendCustomEmail(data);
  return resetToken;
};

const passwordResetLinkWithToken = async (
  token: string,
  newPassword: string
) => {
  if (!token) {
    throw new Error("Token and newPassword are required.");
  }

  // Hash the token in request and search for user with matching passwordResetToken in DB
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const applicant = await Applicant.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!applicant) {
    throw new Error("Token expired or invalid. Please try again.");
  }

  // Handle change password
  applicant.password = newPassword;
  applicant.passwordResetToken = undefined;
  applicant.passwordResetExpires = undefined;

  await applicant.save();
  return { message: "Password reset successful!" };
};

const updateProfilePicture = async (
  applicantId: string,
  profilePicture: string
) => {
  const applicant = await Applicant.findByIdAndUpdate(
    applicantId,
    { profilePicture: profilePicture },
    { new: true }
  );
  return applicant;
};

// Application
const cancelApplication = async (applicationId: any) => {
  try {
    // check if applicationID is in queue
    const applicationQueue = await ApplicationQueue.findOne();

    if (!applicationQueue) {
      throw new Error("No application queue found!");
    }

    // Access applicationIds now that you're sure it's not null
    if (!applicationQueue.applicationIds?.includes(applicationId)) {
      throw new Error("No application found in queue!");
    }

    // remove application from queue
    await ApplicationQueue.updateOne(
      {},
      {
        $pull: {
          applicationIds: applicationId,
        },
      }
    );

    // update application queueStatus to cancelled and applicatype to none
    await Application.updateOne(
      { _id: applicationId },
      {
        $set: {
          queueStatus: "Cancelled",
          applicationType: "None",
        },
      }
    );

    return {
      success: true,
      message: "Application successfully canceled!",
    };
  } catch (error) {
    throw new Error(`Error dequeuing application: ${error}`);
  }
};

const updateProfile = async (data: any, applicantId: any) => {
  validateMongoDBId(applicantId);

  try {
    const { firstname, lastname, email } = data;

    const applicant = await Applicant.findById(applicantId);
    if (!applicant) {
      throw new Error("Applicant not found");
    }

    // Update the applicant's profile information
    applicant.firstname = firstname || applicant.firstname;
    applicant.lastname = lastname || applicant.lastname;
    applicant.email = email || applicant.email;
    // applicant.profilePicture = profilePicture || applicant.profilePicture;

    // Save the updated applicant profile to the database
    await applicant.save();

    // Return the updated applicant profile
    return applicant;
  } catch (error) {
    throw new Error(error as string);
  }
};

export {
  createNewApplicant,
  getAllApplicants,
  getOneApplicant,
  applicantLogin,
  tokenRefresh,
  logoutApplicant,
  sendPasswordResetToken,
  passwordResetLinkWithToken,
  cancelApplication,
  updateProfile,
};
