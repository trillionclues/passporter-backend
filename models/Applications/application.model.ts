import mongoose, { Schema, model } from "mongoose";
import { ApplicationDocument } from "../../types/application.document";

const applicationSchema = new Schema(
  {
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: "Applicant",
      required: true,
    },
    reviewStatus: {
      type: String,
      enum: ["Pending", "Processing", "Approved", "Rejected"],
      default: "Pending",
    },
    applicationType: {
      type: String,
      enum: ["None", "Passport", "Visa"],
      default: "None",
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

// // When creating a new application
// const newApplication = new ApplicationModel({
//     applicant: existingApplicant._id, // where existingApplicant is an instance of the Applicant model
//     // other application fields
//   });

//   await newApplication.save();

//   // When querying applications and populating the applicant field
//   const applications = await ApplicationModel.find().populate('applicant');

// Create a new model for staff members with the following fields:

// Staff ID: A unique identifier for the staff member.

// First Name: The staff member's first name.

// Last Name: The staff member's last name.

// Role: The staff member's role (passport officer, visa officer, etc.).

// Permissions: A list of permissions for the staff member, such as approving passport applications, reviewing visa applications, etc.

// Additionally, you'll need to implement logic to manage the passport application queue and staff review process. This may involve creating separate endpoints for submitting passport applications, viewing the queue, and reviewing applications.
