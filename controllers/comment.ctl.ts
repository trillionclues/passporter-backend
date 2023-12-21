import asyncHandler from "express-async-handler";
import { createApplicantComment } from "../services/Comment/comment.service";
import { CustomRequest } from "../types/CustomRequest";

const createApplicationHandler = asyncHandler(
  async (req: CustomRequest, res) => {
    const applicantId = req.applicant?._id?.toString();
    const userRole = req.applicant?.role

    try {
        const { text, applicationId } = req.body;

        const comment  = await createApplicantComment(text, applicantId, userRole, applicationId);

        res.status(201).send(comment);
    } catch (error) {
        throw new Error(error as string);
    }
  }
);

export { createApplicationHandler };