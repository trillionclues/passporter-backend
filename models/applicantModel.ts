import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const Schema = mongoose.Schema;

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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Applicants", applicantSchema);
