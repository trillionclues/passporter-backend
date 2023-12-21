export interface CommentDocument extends Document {
  text: string;
  userId: string;
  userType: string;
  applicationId: string;
  createdAt: Date;
}
