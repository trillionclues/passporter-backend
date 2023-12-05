import { Schema, model } from "mongoose";
import { ApplicationDocument } from "../../types/application.document";

const applicationSchema = new Schema(
  {
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: "Applicant",
      required: true,
    },
    queueStatus: {
      type: String,
      enum: ["Pending", "Processing", "Approved", "Rejected"],
      default: "Pending",
    },
    passportNumber: {
      type: String,
    },
    visaNumber: {
      type: String,
    },
    queuePosition: {
      type: Number,
      default: 0,
    },
    expirationDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
    applicationType: {
      type: String,
      enum: ["None", "Passport", "Visa"],
      default: "None",
    },
  },
  {
    timestamps: true,
  }
);

// this will create an index on applicantId and applicationType
applicationSchema.index(
  { applicantId: 1, applicationType: 1 },
  { unique: true }
);

export default model<ApplicationDocument>("Application", applicationSchema);
