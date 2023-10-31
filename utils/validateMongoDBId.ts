import mongoose from "mongoose";

export const validateMongoDBId = (
  id:
    | string
    | number
    | mongoose.mongo.BSON.ObjectId
    | mongoose.mongo.BSON.ObjectIdLike
    | Uint8Array
) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);

  if (!isValid) throw new Error("This ID is not found or invalid!");
};
