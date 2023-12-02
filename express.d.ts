// express.d.ts
import { Document } from "mongoose";
import { ApplicantDocument } from "./types/applicant.document";

declare global {
  namespace Express {
    export interface Request {
      applicant?: ApplicantDocument;
    }
  }
}
