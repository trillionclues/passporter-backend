import Applicant from "../../models/ApplicantModel/applicant.model";
import ApplicationQueue from "../../models/Application Queue/applicationqueue.model";
import Application from "../../models/Applications/application.model";
import { validateMongoDBId } from "../../utils/validateMongoDBId";

const createNewApplication = async (
  applicationData: any,
  applicantId: string
) => {
  validateMongoDBId(applicantId);
  console.log(applicationData);
  console.log(applicantId);

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
  } catch (error: any) {
    // Rollback the transaction
    await session.abortTransaction();
    throw new Error(error);
  } finally {
    session.endSession();
  }
};

export { createNewApplication };

// Enqueue the new application ID
// await ApplicationQueue.findOneAndUpdate(
//   { applicantId: applicantId },
//   {
//     $push: {
//       applicationIds: newApplication?._id,
//     },
//   },
//   { upsert: true }
// );
