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
      enum: ["Pending", "Processing", "Approved", "Rejected", "Cancelled"],
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
    processingState: {
      type: String,
    },
    processingOffice: {
      type: String,
    },
    bookletType: {
      type: String,
      enum: ["32 Pages", "64 Pages"],
      default: "32 Pages",
    },
    applicationType: {
      type: String,
      enum: ["None", "Passport", "Visa"],
      default: "None",
    },
    notes: {
      type: String,
    },
    validity: {
      type: String,
      enum: ["5years", "10years", "15years"],
      default: "5years",
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
