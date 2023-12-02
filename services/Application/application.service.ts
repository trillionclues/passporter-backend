import Applicant from "../../models/ApplicantModel/applicant.model";
import Application from "../../models/Applications/application.model";
import { ApplicationDocument } from "../../types/application.document";
import { validateMongoDBId } from "../../utils/validateMongoDBId";

const createNewApplication = async (applicantId: any, applicationData: any) => {
  validateMongoDBId(applicantId);

  // Start a MongoDB transaction
  const session = await Application.startSession();
  session.startTransaction();

  try {
    const applicant = await Applicant.findById(applicantId);
    if (!applicant) {
      throw new Error("Applicant not found. Unable to create application.");
    }

    // Check if applicant already has an application of the same type
    const existingApplication = await Application.findOne({
      applicant: applicantId,
      applicationType: applicationData.applicationType,
    });

    if (existingApplication) {
      throw new Error("You already have an application of this type!");
    }

    // Create application
    const newApplication = await Application.create({
      applicant: applicantId,
      ...applicationData,
    });

    await newApplication.save();

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
