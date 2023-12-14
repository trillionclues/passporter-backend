import { Request } from "express";
import { AdminDocument } from "./admin.document";

export interface AdminRequest extends Request {
  admin?: AdminDocument;
}
