import { CustomRequest } from "../types/CustomRequest";
import asyncHandler from "express-async-handler";
import {
  getAllQueueApplications,
  getApplicantsWithRoleUpgradeRequests,
  processApplicantRoleUpgradeRequests,
} from "../services/Admin/admin.service";

const handleGetAllQueueApplications = asyncHandler(async (req, res) => {
  try {
    const applications = await getAllQueueApplications();
    res.json({ applications });
  } catch (error) {
    throw new Error(error as string);
  }
});

const handleGetRoleUpgradeRequests = asyncHandler(async (req, res) => {
  try {
    const roleUpgradeRequests = await getApplicantsWithRoleUpgradeRequests();
    res.json({ roleUpgradeRequests });
  } catch (error) {
    throw new Error(error as string);
  }
});

const handleProcessRoleUpgrade = asyncHandler(async (req, res) => {
  const { applicantId, action } = req.params;

  try {
    // validate action
    if (action !== "reject" && action !== "approve") {
      res.status(400).json({ error: "Invalid action" });
    }

    const result = await processApplicantRoleUpgradeRequests(
      applicantId,
      action
    );
    res.json(result);
  } catch (error) {
    throw new Error(error as string);
  }
});

export {
  handleGetAllQueueApplications,
  handleGetRoleUpgradeRequests,
  handleProcessRoleUpgrade,
};
