export interface CommentDocument extends Document {
  text: string;
  adminId: string;
  applicationId: string;
  createdAt: Date;
}
