import { Document, Schema } from 'mongoose';

export interface ApplicationDocument extends Document {
  applicantId?: Schema.Types.ObjectId;
  reviewStatus: 'Pending' | 'Processing' | 'Approved' | 'Rejected';
  applicationType: 'None' | 'Passport' | 'Visa';
  passportNumber?: string;
  visaNumber?: string;
  queuePosition?: number;
  expirationDate?: Date;
  notes?: string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}
