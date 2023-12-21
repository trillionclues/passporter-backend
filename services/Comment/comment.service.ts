import Comment from "../../models/Comments/comments.model";
import Application from "../../models/ApplicantModel/applicant.model";
import Applicant from "../../models/ApplicantModel/applicant.model";
import Admin from "../../models/Admin Model/admin.model";

const createApplicantComment = async (
  text: string,
  applicantId: any,
  userRole: any,
  applicationId: string
) => {
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
      applicantId,
      userRole,
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

export { createApplicantComment };
