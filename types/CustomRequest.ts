import { Request } from "express";
import { ApplicantDocument } from "./ApplicantDocument";

export interface CustomRequest extends Request {
  applicant?: ApplicantDocument;
}
