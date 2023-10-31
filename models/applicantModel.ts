import { Schema, model } from "mongoose";
import { ApplicantDocument } from "../types/ApplicantDocument";
import bcrypt from "bcrypt";
import crypto from "crypto";

const applicantSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    // refreshToken: String,
  },
  {
    timestamps: true,
  }
);

applicantSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const saltRounds = 10;
  const genSalt = await bcrypt.genSaltSync(saltRounds);
  this.password = await bcrypt.hash(this.password, genSalt);
  next();
});

applicantSchema.methods.isPasswordMatched = async function (
  enteredPassword: string | Buffer
) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default model<ApplicantDocument>("Applicants", applicantSchema);
