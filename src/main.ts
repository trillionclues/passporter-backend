import express from "express";
import cors from "cors";
import morgan from "morgan";
import { json, urlencoded } from "body-parser";
import cookieParser from "cookie-parser";
import authRoute from "../routes/auth.route";
import dbConnect from "../config/dbConnect";
import { errorHandler, notFound } from "../middlewares/errorHandler";
import applicantApplicationRoute from "../routes/applicantApplications.route";
import applicationQueueRoute from "../routes/queue.route";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
dbConnect();

app.use(morgan("dev")); // timestamps in terminal
app.use(json()); // parse HTTP request body
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.get("/", (req, res) => {
  console.log("test");
  res.send("Welcome to Passporter!");
});

// routes
app.use("/api/applicant", authRoute);
app.use("/api/application", applicantApplicationRoute);
app.use("/api/queue", applicationQueueRoute);

// error middlwares
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
