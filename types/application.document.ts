import { Document, Schema, Types } from "mongoose";

export interface ApplicationDocument extends Document {
  applicantId?: Schema.Types.ObjectId;
  processedBy?: Schema.Types.ObjectId;
  reviewStatus: "Pending" | "Processing" | "Approved" | "Rejected";
  applicationType: "None" | "Passport" | "Visa";
  passportNumber?: string;
  visaNumber?: string;
  queuePosition: number;
  processingState: string;
  processingOffice: string;
  bookletType: "32 Pages" | "64 Pages";
  validity: "5years" | "10years" | "15years";
  queueStatus?:
    | "Pending"
    | "Processing"
    | "Approved"
    | "Rejected"
    | "Cancelled";
  queueStatusHistory?: {
    status: "Pending" | "Processing" | "Approved" | "Rejected" | "Cancelled";
    timestamp: Date;
  };
  expirationDate?: Date;
  comments?: Types.ObjectId[];
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}
