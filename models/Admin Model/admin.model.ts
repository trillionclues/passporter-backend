import { Schema, model } from "mongoose";
import { AdminDocument } from "../../types/admin.document";

const adminSchema = new Schema(
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
      unique: true,
    },
    role: {
      type: String,
      default: "admin",
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
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

export default model<AdminDocument>("Admin", adminSchema);
//   // When querying applications and populating the applicant field
//   const applications = await ApplicationModel.find().populate('applicant');

// Create a new model for staff members with the following fields:

// Staff ID: A unique identifier for the staff member.

// First Name: The staff member's first name.

// Last Name: The staff member's last name.

// Role: The staff member's role (passport officer, visa officer, etc.).

// Permissions: A list of permissions for the staff member, such as approving passport applications, reviewing visa applications, etc.

// Additionally, you'll need to implement logic to manage the passport application queue and staff review process. This may involve creating separate endpoints for submitting passport applications, viewing the queue, and reviewing applications.

// const processApplication = async (applicantId: any) => {
//   // Dequeue the application ID
//   const queue = await ApplicationQueue.findOneAndUpdate(
//     { applicantId: applicantId },
//     { $pop: { applicationIds: -1 } }
//   );

//   if (queue) {
//     const applicationId = queue.applicationIds[0];

//     // Process the application with the retrieved applicationId
//     // ...

//     // Optionally, update the application status or perform other actions
//     await Application.findByIdAndUpdate(
//       applicationId,
//       { reviewStatus: "Processed" },
//       { new: true }
//     );

//     return applicationId;
//   } else {
//     // No application in the queue
//     return null;
//   }
// };

// Example logic when processing applications
// const processApplication = async () => {
//     const applicationQueue = await ApplicationQueue.findOne();
//     const applicationId = await applicationQueue.dequeueApplication();

//     // Update the application status to "Processing"
//     await Application.findByIdAndUpdate(applicationId, {
//       $set: { queueStatus: "Processing" },
//     });

//     // ... (additional processing logic)
//   };

// Enqueue the application ID
// const applicationQueue = await ApplicationQueue.findOne();
// await applicationQueue.enqueueApplication(newApplication._id);

// dequeuue applicaitionid as staff
// req.body.applicationId;

// try {
//   // check if the provided applicationId matches a valid application _id in the database
//   const applicationExists = await Application.exists({ _id: applicationId });

//   if (!applicationExists) {
//     throw new Error(`Invalid application ID: ${applicationId}`);
//   }

//   const result = await dequeueApplication(applicationId);
//   res.json(result);
// } catch (error) {
//   throw new Error(error as string);
// }
