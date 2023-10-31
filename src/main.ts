import express from "express";
import cors from "cors";
import morgan from "morgan";
import { json, urlencoded } from "body-parser";
import { errorHandler, notFound } from "../middlewares/errorHandler";
import authRoute from "../routes/authRoutes";
import dbConnect from "../config/dbConnect";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
dbConnect();

app.use(morgan("dev")); // timestamps in terminal
app.use(json()); // parse HTTP request body
app.use(urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to Passporter!");
});

// routes
app.use("/api/applicants/auth", authRoute);

// error middlwares
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
