import Applicant from "../../models/ApplicantModel/applicant.model";
import Application from "../../models/Applications/application.model";
import { validateMongoDBId } from "../../utils/validateMongoDBId";

const createNewApplication = async (applicationData: any, applicantId: any) => {
  validateMongoDBId(applicantId);

  // Start a MongoDB transaction
  const session = await Application.startSession();
  session.startTransaction();

  try {
    const newApplication = await Application.create({
      applicant: applicantId,
      ...applicationData,
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
  } catch (error) {
    // Rollback the transaction
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export { createNewApplication };
