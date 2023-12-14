import { Schema, model } from "mongoose";
import { ApplicationDocument } from "../../types/application.document";

const applicationSchema = new Schema(
  {
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: "Applicant",
      required: true,
    },
    processedBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
    queueStatus: {
      type: String,
      enum: ["Pending", "Processing", "Approved", "Rejected", "Cancelled"],
      default: "Pending",
    },
    queueStatusHistory: [
      {
        status: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
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
      required: true,
    },
    processingOffice: {
      type: String,
      required: true,
    },
    bookletType: {
      type: String,
      enum: ["32 Pages", "64 Pages"],
      default: "32 Pages",
      required: true,
    },
    applicationType: {
      type: String,
      enum: ["None", "Passport", "Visa"],
      required: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    validity: {
      type: String,
      enum: ["5years", "10years", "15years"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// this will create an index on applicantId and applicationType
applicationSchema.index(
  { applicantId: 1, applicationType: 1 },
  { unique: false }
);

export default model<ApplicationDocument>("Application", applicationSchema);
