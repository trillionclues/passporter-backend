import { Schema, Document } from "mongoose";

export interface ApplicantDocument extends Document {
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  address?: string;
  profilePicture?: String;
  isPasswordMatched(enteredPassword: string): Promise<boolean>;
  createPasswordResetToken(): Promise<string>;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  applications: Schema.Types.ObjectId[];
  queueStatus: "InQueue" | "Reviewed";
  refreshToken?: string;
  role: string;
  roleUpgradeRequest: "pending" | "approved" | "rejected" | "none";
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
