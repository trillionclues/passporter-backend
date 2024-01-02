import Applicant from "../models/ApplicantModel/applicant.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import { CustomRequest } from "../types/CustomRequest";
import { NextFunction } from "express";
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

const adminMiddleware = asyncHandler(
  async (req: CustomRequest, res, next: NextFunction) => {
    let token;

    if (req?.headers?.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];

      if (!JWT) {
        throw new Error("Wrong JWT secret");
      }
      try {
        if (jwt) {
          const decoded = jwt.verify(token, JWT) as JwtPayload;
          const user = await Applicant.findById(decoded?.id);
          if (user && user.role === "admin") {
            req.admin = user;
            next();
          } else {
            throw new Error("Not authorized, user is not an admin");
          }
        }
      } catch (error) {
        next(error);
        throw new Error("You are not authorized, token failed");
      }
    } else {
      throw new Error("There is no token attached to header");
    }
  }
);

export { authMiddleware, adminMiddleware };
