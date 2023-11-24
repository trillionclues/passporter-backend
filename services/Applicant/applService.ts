import { ParamsDictionary } from "express-serve-static-core";
import Applicant from "../../models/applicantModel";
import { validateMongoDBId } from "../../utils/validateMongoDBId";
import { generateRefreshToken } from "../../utils/generateRefreshToken";
import { generateToken } from "../../utils/jwtToken";
import jwt from "jsonwebtoken";

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

export {
  createNewApplicant,
  getAllApplicants,
  getOneApplicant,
  applicantLogin,
  deleteApplicant,
  updateApplicant,
  tokenRefresh,
  logoutApplicant,
};
