import { AnyNsRecord } from "dns";
import Applicant from "../../models/ApplicantModel/applicant.model";
import Application from "../../models/Applications/application.model";
import { ApplicationDocument } from "../../types/application.document";
import { validateMongoDBId } from "../../utils/validateMongoDBId";
import { enqueueApplication } from "../Application Queue/applicationQueue. service";
import { ParamsDictionary } from "express-serve-static-core";

const createNewApplication = async (
  applicationData: ApplicationDocument,
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

// get all applicant applications either passport or visa
const getApplicantApplications = async (applicantId: any) => {
  validateMongoDBId(applicantId);
  // console.log(applicantId);

  const applicant = await Applicant.findById(applicantId).populate(
    "applications"
  );

  if (!applicant) {
    throw new Error("Applicant not found");
  }

  return applicant.applications;
};

const getSingleApplication = async (data: any) => {
  const { id } = data;
  validateMongoDBId(id);

  const application = await Application.findById(id);

  if (!application) {
    throw new Error("Application not found");
  }

  return application;
};

export { createNewApplication, getApplicantApplications, getSingleApplication };
