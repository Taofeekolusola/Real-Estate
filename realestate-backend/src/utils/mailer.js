// utils/mailer.js
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config();
const fs = require('fs');

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.error('Missing SMTP credentials. Email will not be sent.');
    return;
  }

  console.log(`Sending email to ${to} with subject "${subject}"`);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Lagos Rentals" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
  });
};

// ✅ NEW FUNCTION: with PDF attachment
const sendEmailWithPdf = async ({ to, subject, html, attachment }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Lagos Rentals" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
    attachments: [
      {
        filename: attachment.filename || "Lease-Agreement.pdf",
        content: attachment.content, // this is the buffer
        contentType: "application/pdf",
      },
    ],
  });

  console.log(`PDF sent to ${to}`);
};

module.exports = {
  sendEmail,
  sendEmailWithPdf,
};