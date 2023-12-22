import { Document, Schema } from "mongoose";

export interface AdminDocument extends Document {
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  profilePicture?: String;
  isPasswordMatched(enteredPassword: string): Promise<boolean>;
  createPasswordResetToken(): Promise<string>;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  refreshToken?: string;
  role?: "passport_officer" | "visa_officer" | "admin";
  assignedApplicants?: Schema.Types.ObjectId[];
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
