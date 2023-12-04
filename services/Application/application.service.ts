import Applicant from "../../models/ApplicantModel/applicant.model";
import ApplicationQueue from "../../models/Application Queue/applicationqueue.model";
import Application from "../../models/Applications/application.model";
import { validateMongoDBId } from "../../utils/validateMongoDBId";

const createNewApplication = async (applicationData: any, applicantId: any) => {
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
      applicant: applicantId,
      ...applicationData,
      queuePosition: newQueuePosition,
    });

    // Enqueue the new application ID
    await ApplicationQueue.findOneAndUpdate(
      { applicantId: applicantId },
      {
        $push: {
          applicationIds: newApplication?._id,
        },
      },
      { upsert: true }
    );

    // Update applicant with new application
    await Applicant.findByIdAndUpdate(
      applicantId,
      {
        $push: {
          applications: newApplication._id,
        },
      },
      {
        new: true,
      }
    );

    // Commit the transaction
    await session.commitTransaction();
    return newApplication;
  } catch (error) {
    // Rollback the transaction
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

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

export { createNewApplication };
