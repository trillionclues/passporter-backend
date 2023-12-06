import { Document, Schema } from "mongoose";

export interface ApplicationDocument extends Document {
  applicantId?: Schema.Types.ObjectId;
  reviewStatus: "Pending" | "Processing" | "Approved" | "Rejected";
  applicationType: "None" | "Passport" | "Visa";
  passportNumber?: string;
  visaNumber?: string;
  queuePosition?: number;
  processingState?: string;
  processingOffice?: string;
  bookletType?: "32 Pages" | "64 Pages";
  validity?: "5years" | "10years" | "15years";
  queueStatus?:
    | "Pending"
    | "Processing"
    | "Approved"
    | "Rejected"
    | "Cancelled";
  expirationDate?: Date;
  notes?: string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}
