import Applicant from "../../models/ApplicantModel/applicant.model";
import ApplicationQueue from "../../models/Application Queue/applicationqueue.model";
import Application from "../../models/Applications/application.model";
import { validateMongoDBId } from "../../utils/validateMongoDBId";
import { enqueueApplication } from "../Application Queue/applicationQueue. service";

const createNewApplication = async (
  applicationData: any,
  applicantId: string
) => {
  validateMongoDBId(applicantId);

  // Start a MongoDB transaction
  const session = await Application.startSession();
  session.startTransaction();

  try {
    // handle global queue position (regardless of the applicant),
    const lastQueuePosition = await Application.findOne({})
      .sort({ queuePosition: -1 })
      .select("queuePosition");

    // calculate new application queue position
    const newQueuePosition =
      lastQueuePosition && lastQueuePosition.queuePosition
        ? lastQueuePosition.queuePosition + 1
        : 1;

    // create new application
    const newApplication = await Application.create({
      applicantId: applicantId,
      ...applicationData,
      queuePosition: newQueuePosition,
    });

    // Enqueue the newly created application and save
    await enqueueApplication(newApplication._id);

    // Commit the transaction
    await session.commitTransaction();
    return newApplication;
  } catch (error: any) {
    // Rollback the transaction
    await session.abortTransaction();
    throw new Error(error);
  } finally {
    session.endSession();
  }
};

export { createNewApplication };

// *** BUG ***** //
// Error updated and saving applicationqueue records
// await ApplicationQueue.findOneAndUpdate(
//   {},
//   {
//     $push: {
//       applicationIds: newApplication._id,
//     },
//   },
//   {
//     upsert: true,
//   }
// );

//
