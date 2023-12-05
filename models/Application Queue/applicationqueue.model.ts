import { Schema, model } from "mongoose";
import { ApplicationQueueDocument } from "../../types/applicationqueue.document";
import Application from "../Applications/application.model";

const applicationQueueSchema = new Schema(
  {
    applicationIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
  },
  {
    timestamps: true,
  }
);

//  check applicationIds only reference existing applications
applicationQueueSchema.pre("validate", async function (next) {
  const { applicationIds } = this;
  for (const applicationId of applicationIds) {
    const applicationExists = await Application.exists({ _id: applicationId });
    if (!applicationExists) {
      throw new Error(`Invalid application ID: ${applicationId}`);
    }
  }
  next();
});

//   applicationQueueSchema.pre("save", async function (next) {
//     // Update queue position based on your logic
//     // ...

//     next();
//   });

//   applicationQueueSchema.post("save", async function () {
//     // Update application status or send notifications based on processing outcome
//     // ...
//   });

export default model<ApplicationQueueDocument>(
  "ApplicationQueue",
  applicationQueueSchema
);
