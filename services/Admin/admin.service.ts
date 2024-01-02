import Applicant from "../../models/ApplicantModel/applicant.model";
import Application from "../../models/Applications/application.model";
import ApplicationQueue from "../../models/Application Queue/applicationqueue.model";
import { ApplicationDocument } from "../../types/application.document";
import { validateMongoDBId } from "../../utils/validateMongoDBId";

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

export { getAllQueueApplications };
