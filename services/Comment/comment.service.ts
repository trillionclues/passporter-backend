import Comment from "../../models/Comments/comments.model";
import Application from "../../models/Applications/application.model";
import Applicant from "../../models/ApplicantModel/applicant.model";
import Admin from "../../models/Admin Model/admin.model";
import { validateMongoDBId } from "../../utils/validateMongoDBId";

const createApplicantComment = async (
  text: string,
  applicantId: any,
  userRole: any,
  applicationId: string
) => {
  validateMongoDBId(applicantId);

  try {
    const applicant = await Applicant.findById(applicantId);
    if (!applicant) {
      throw new Error("Applicant not found");
    }

    // Check if the application with the specified ID exists
    const application = await Application.findById(applicationId);
    if (!application) {
      throw new Error("Application not found");
    }

    // Create the comment
    const comment = new Comment({
      text,
      userId: applicantId,
      userType: userRole,
      applicationId,
    });

    // Save the comment to the database
    await comment.save();

    // Add the comment to the application's comments array
    await Application.updateOne(
      { _id: applicationId },
      { $push: { comments: comment._id } }
    );

    return comment;
  } catch (error) {
    throw new Error(error as string);
  }
};

const getAllCommentsForApplication = async (applicationId: string) => {
  try {
    const comments = await Comment.find({ applicationId }).exec();

    // Extract commenter information for each comment
    const commenterDetails = await Promise.all(
      comments.map(async (comment) => {
        let commenterName = "Unknown";
        if (comment.userType === "applicant") {
          const applicant = await Applicant.findById(comment.userId);
          if (applicant) {
            commenterName = `${applicant.firstname} ${applicant.lastname}`;
          }
        } else if (comment.userType === "admin") {
          const admin = await Admin.findById(comment.userId);
          if (admin) {
            commenterName = `${admin.firstname} ${admin.lastname}`;
          }
        }
        return { commenterName, commentText: comment.text };
      })
    );

    return commenterDetails;
  } catch (error) {
    throw new Error(error as string);
  }
};

export { createApplicantComment, getAllCommentsForApplication };
