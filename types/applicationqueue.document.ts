import { Document, Schema } from "mongoose";

export interface ApplicationQueueDocument extends Document {
  applicantId?: Schema.Types.ObjectId;
  applicationIds: Schema.Types.ObjectId[];
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}
