import nodemailer from "nodemailer";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();

const MAIL_ID = process.env.MAIL_ID;
const MP = process.env.MP;

export const sendCustomEmail = async (data: any) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, //true for 465, false for 587
    auth: {
      user: MAIL_ID,
      pass: MP,
    },
  });

  const mailOptions = {
    from: `"Passporter" <${MAIL_ID}>`,
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.htm,
  };

  await transporter.sendMail(mailOptions);

  console.log("Email sent successfully");
};
