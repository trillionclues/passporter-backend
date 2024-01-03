import Applicant from "../../models/ApplicantModel/applicant.model";
import Application from "../../models/Applications/application.model";
import ApplicationQueue from "../../models/Application Queue/applicationqueue.model";
import { ApplicationDocument } from "../../types/application.document";
import { validateMongoDBId } from "../../utils/validateMongoDBId";
import { ApplicantDocument } from "../../types/applicant.document";

const getAllQueueApplications = async () => {
  const applicationQueue = await ApplicationQueue.findOne({});

  if (!applicationQueue) {
    throw new Error("No application queue found!");
  }

  // Fetch details for each application in the queue
  const applicationIds = applicationQueue.applicationIds || [];
  const applications = await Application.find({ _id: { $in: applicationIds } });

  return applications;
};

const getApplicantsWithRoleUpgradeRequests = async () => {
  const applicantsWithRoleUpgradeRequest = await Applicant.find({
    roleUpgradeRequest: {
      $in: ["pending"],
    },
  });

  return applicantsWithRoleUpgradeRequest;
};

const processApplicantRoleUpgradeRequests = async (
  applicantId: any,
  action: any
) => {
  try {
    const applicant = await Applicant.findById(applicantId);

    if (!applicant) {
      console.error(`Applicant not found with ID: ${applicantId}`);
      return;
    }

    // handling rejection
    if (action === "reject") {
      await Applicant.updateOne(
        { _id: applicant._id },
        { $set: { roleUpgradeRequest: "rejected" } }
      );
      return {
        success: true,
        message: "Applicant request rejected successfully",
      };
    }

    const currentDate = new Date();
    const accountCreationDate = applicant.createdAt
      ? new Date(applicant.createdAt)
      : null;

    const thresholdDuration = 1 * 30 * 24 * 60 * 60 * 1000; // 1 month

    // Check if the applicant has been using the platform for at least the threshold duration
    const currentDateTimestamp = currentDate.getTime();
    const accountCreationDateTimestamp = accountCreationDate
      ? accountCreationDate.getTime()
      : 0;

    const shouldApprove =
      currentDateTimestamp - accountCreationDateTimestamp >= thresholdDuration;

    // Condition for immediate upgrade
    const shouldUpgradeImmediately = true;

    // Update the user roleUpgradeRequest and role status
    const updateFields = {
      $set: {
        roleUpgradeRequest:
          shouldApprove || shouldUpgradeImmediately ? "approved" : "rejected",
      },
    };

    // Update the applicant role status
    const updateApplicantRole = {
      $set: {
        role: shouldApprove || shouldUpgradeImmediately ? "admin" : "applicant",
      },
    };

    // Update the applicant
    await Applicant.updateOne({ _id: applicant._id }, updateFields);
    await Applicant.updateOne({ _id: applicant._id }, updateApplicantRole);

    // console.log(`Applicant ${applicantId} processed successfully`);
    return { success: true, message: "Applicant processed successfully" };
  } catch (error) {
    console.error(`Error processing applicant role upgrade request: ${error}`);
  }
};

export {
  getAllQueueApplications,
  getApplicantsWithRoleUpgradeRequests,
  processApplicantRoleUpgradeRequests,
};
