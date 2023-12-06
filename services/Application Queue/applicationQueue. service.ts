import ApplicationQueue from "../../models/Application Queue/applicationqueue.model";
import Application from "../../models/Applications/application.model";
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

const dequeueApplication = async (applicationId: any) => {
  try {
    // find application queue
    const applicationQueue = await ApplicationQueue.findOne();
    if (!applicationQueue) {
      throw new Error("No application queue found!");
    }

    // remove application from queue and the position
    await ApplicationQueue.updateOne(
      {},
      {
        $pull: {
          applicationIds: applicationId,
        },
      }
    );

    return {
      success: true,
      message: "Application successfully dequeued!",
    };
  } catch (error) {
    throw new Error(`Error dequeuing application: ${error}`);
  }
};

const dequeueAllApplications = async () => {
  try {
    // find application queue
    const applicationQueue = await ApplicationQueue.findOne();
    if (!applicationQueue) {
      throw new Error("No application queue found!");
    }

    // clear the application queue
    await ApplicationQueue.updateOne(
      {},
      {
        $set: {
          applicationIds: [],
        },
      }
    );

    return {
      success: true,
      message: "All applications successfully dequeued!",
    };
  } catch (error) {
    throw new Error(`Error dequeuing all applications: ${error}`);
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

export { enqueueApplication, dequeueApplication, dequeueAllApplications };
