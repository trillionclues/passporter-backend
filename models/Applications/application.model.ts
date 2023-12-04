import mongoose, { Schema, model } from "mongoose";
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
    applicationType: {
      type: String,
      enum: ["None", "Passport", "Visa"],
      default: "None",
      unique: true,
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
  },
  {
    timestamps: true,
  }
);

export default model<ApplicationDocument>("Application", applicationSchema);

// //  MIGHT NEED A HOOK FORN THIS
// applicationSchema.pre("save", async function (next) {
//   const existingApplication = await Application.findOne({
//     applicant: this.applicantId,
//     applicationType: this.applicationType,
//   });

//   if (existingApplication) {
//     throw new Error("You already have an application of this type!");
//   }

//   next();
// });
