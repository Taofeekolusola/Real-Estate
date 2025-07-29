// utils/mailer.js
const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
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

module.exports = sendEmail;