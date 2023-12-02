import Applicant from "../models/ApplicantModel/applicant.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";

import dotenv from "dotenv";
import { CustomRequest } from "../types/CustomRequest";
dotenv.config();

const JWT = process.env.JWT_SECRET;
const authMiddleware = asyncHandler(async (req: CustomRequest, res, next) => {
  let token;

  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    if (!JWT) {
      throw new Error("Wrong JWT secret");
    }

    try {
      if (jwt) {
        const decoded = jwt.verify(token, JWT) as JwtPayload;
        const applicant = await Applicant.findById(decoded?.id);
        if (applicant) {
          req.applicant = applicant;

          next();
        }
      }
    } catch (error) {
      next(error);
      throw new Error("Not authorized, token failed");
    }
  } else {
    throw new Error("There is no token attached to header");
  }
});

export { authMiddleware };
