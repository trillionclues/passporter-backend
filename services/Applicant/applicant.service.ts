import { ParamsDictionary } from "express-serve-static-core";
import Applicant from "../../models/ApplicantModel/applicant.model";
import { validateMongoDBId } from "../../utils/validateMongoDBId";
import { generateRefreshToken } from "../../utils/generateRefreshToken";
import { generateToken } from "../../utils/jwtToken";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ApplicantDocument } from "../../types/applicant.document";
import generateEmailBody from "../../views/emailBody";
import { sendCustomEmail } from "../Email/email.service";

const createNewApplicant = async (body: any) => {
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

const applicantLogin = async (data: { email: string; password: string }) => {
  const { email, password } = data;

  const findApplicant = await Applicant.findOne({ email });

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

    return {
      _id: findApplicant?._id,
      firstname: findApplicant?.firstname,
      lastname: findApplicant?.lastname,
      token: generateToken(findApplicant?._id),
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

const updateApplicant = async (body: any) => {
  const { _id, firstname, lastname, email } = body;
  validateMongoDBId(_id);
  const updateData = {
    firstname: firstname || undefined,
    lastname: lastname || undefined,
    email: email || undefined,
  };

  const updatedApplicant = await Applicant.findByIdAndUpdate(_id, updateData, {
    new: true,
  });
  return updatedApplicant;
};

const deleteApplicant = async (data: ParamsDictionary) => {
  const { id } = data;
  validateMongoDBId(id);
  const deleteApp = await Applicant.findByIdAndDelete(id);
  return deleteApp;
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

// const changeUserPassword = async(_id: string, newPassword: string) => {
//   validateMongoDBId(_id);
//   const applicant: ApplicantDocument | null = await Applicant.findById(_id);

//   if (newPassword) {
//     applicant.password = newPassword;

//     // update and save password
//     const updatePassword = await applicant.save();
//     return updatePassword;
//   } else {
//     return applicant;
//   }
// }

export {
  createNewApplicant,
  getAllApplicants,
  getOneApplicant,
  applicantLogin,
  deleteApplicant,
  updateApplicant,
  tokenRefresh,
  logoutApplicant,
  sendPasswordResetToken,
  passwordResetLinkWithToken,
};
