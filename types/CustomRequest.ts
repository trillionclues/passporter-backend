import { Request } from "express";
import { ApplicantDocument } from "./applicant.document";

export interface CustomRequest extends Request {
  applicant?: ApplicantDocument;
}
