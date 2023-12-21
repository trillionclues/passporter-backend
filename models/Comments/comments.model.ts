import { Schema, model } from "mongoose";
import { CommentDocument } from "../../types/comment.document";

const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    userType: {
      type: String,
      enum: ["admin", "applicant"],
      required: true,
    },
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "Applications",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default model<CommentDocument>("Comment", commentSchema);
