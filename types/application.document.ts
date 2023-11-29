import { Document, Schema } from "mongoose";

export interface ApplicationDocument extends Document {
  applicantId: Schema.Types.ObjectId;
  reviewStatus: "Pending" | "Approved" | "Rejected";
  applicationType: "Passport" | "Visa";
  queuePosition: number;
}
