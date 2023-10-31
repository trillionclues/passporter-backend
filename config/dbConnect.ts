import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mySecret = process.env.MONGODB_URL;

// connect to mongodb
const dbConnect = async () => {
  if (!mySecret) {
    throw new Error(
      "MONGODB_URL is not defined in your environment variables."
    );
  }
  try {
    const conn = await mongoose.connect(mySecret);
    console.log("Connected to Database!");
  } catch (error) {
    throw new Error(`Error connecting to MongoDB: ${error}`);
  }
};

export default dbConnect;
