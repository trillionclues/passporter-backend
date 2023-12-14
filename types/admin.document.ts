import { Document } from "mongoose";

export interface AdminDocument extends Document {
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  profilePictureUrl?: String;
  isPasswordMatched(enteredPassword: string): Promise<boolean>;
  createPasswordResetToken(): Promise<string>;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  refreshToken?: string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
