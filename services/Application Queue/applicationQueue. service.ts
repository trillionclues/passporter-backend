import ApplicationQueue from "../../models/Application Queue/applicationqueue.model";
import { validateMongoDBId } from "../../utils/validateMongoDBId";

const enqueueApplication = async (applicationId: any) => {
  validateMongoDBId(applicationId);

  try {
    // find application id in applicationqueue
    const applicationIDExists = await ApplicationQueue.findOne({
      applicationIds: applicationId,
    });

    if (applicationIDExists) {
      throw new Error("Application already in queue!");
    }

    //  // Add application to queue and set the position in the queue
    await ApplicationQueue.updateOne(
      {},
      {
        $push: {
          applicationIds: applicationId,
        },
      },
      {
        upsert: true,
      }
    );

    return {
      success: true,
    };
  } catch (error) {
    throw new Error(`Error enqueuing application: ${error}`);
  }
};

const dequeueApplication = async () => {
  try {
    // find application queue
    const applicationQueue = await ApplicationQueue.findOne();
    if (!applicationQueue) {
      throw new Error("No application queue found!");
    }

    const applicationId = applicationQueue.applicationIds.shift();

    if (!applicationId) {
      throw new Error("No applications in the queue!");
    }
    await ApplicationQueue.updateOne(
      {},
      { $pull: { applicationIds: applicationId } }
    );
    return {
      success: true,
      applicationId: applicationId,
    };
  } catch (error) {
    throw new Error(`Error dequeuing application: ${error}`);
  }
};

const updateApplicationStatus = async (
  applicationId: string,
  status: string
) => {};

const updateQueuePosition = async (
  applicationId: string,
  newQueuePosition: number
) => {};

export { enqueueApplication, dequeueApplication };
