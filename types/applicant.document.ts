import { Document } from "mongoose";

export interface ApplicantDocument extends Document {
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  address?: string;
  isPasswordMatched(enteredPassword: string): Promise<boolean>;
  createPasswordResetToken(): Promise<string>;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date
}
