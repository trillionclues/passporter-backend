import { Schema, model } from "mongoose";
import { ApplicantDocument } from "../../types/applicant.document";
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
    refreshToken: {
      type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

applicantSchema.pre("save", async function (next) {
  // check if password is not modified, hash again...
  if (!this.isModified("password")) {
    return next();
  }

  const saltRounds = 10;
  const genSalt = await bcrypt.genSaltSync(saltRounds);
  this.password = await bcrypt.hash(this.password, genSalt);
  next();
});

// compare entered password
applicantSchema.methods.isPasswordMatched = async function (
  enteredPassword: string | Buffer
) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// password reset token
applicantSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // set expiration time
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10mins
  return resetToken;
};

export default model<ApplicantDocument>("Applicants", applicantSchema);
