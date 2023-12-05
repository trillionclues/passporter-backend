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

export default model<ApplicationQueueDocument>(
  "ApplicationQueue",
  applicationQueueSchema
);
