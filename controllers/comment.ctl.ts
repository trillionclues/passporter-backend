import asyncHandler from "express-async-handler";
import {
  createApplicantComment,
  getAllCommentsForApplication,
} from "../services/Comment/comment.service";
import { CustomRequest } from "../types/CustomRequest";

const createCommentHandler = asyncHandler(async (req: CustomRequest, res) => {
  const applicantId = req.applicant?._id?.toString();
  const userRole = req.applicant?.role;

  try {
    const { text, applicationId } = req.body;

    const comment = await createApplicantComment(
      text,
      applicantId,
      userRole,
      applicationId
    );

    res.status(201).send(comment);
  } catch (error) {
    throw new Error(error as string);
  }
});

const getAllCommentsForApplicationHandler = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  try {
    const comments = await getAllCommentsForApplication(applicationId);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export { createCommentHandler, getAllCommentsForApplicationHandler };
