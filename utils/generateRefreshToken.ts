import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const mySecret = process.env.JWT_SECRET;

export const generateRefreshToken = (id: any) => {
  if (!mySecret) {
    throw new Error("Wrong JWT secret");
  }
  return jwt.sign({ id }, mySecret, { expiresIn: "3d" }); // 72hrs
};
