// testMailer.js
require("dotenv").config();

const sendEmail = require("./src/utils/mailer");

sendEmail({
  to: "ade@oegmail.com",
  subject: "Test Email from Lagos Rentals",
  html: "<p>This is a test email to verify nodemailer setup.</p>",
})
  .then(() => console.log("Email sent successfully"))
  .catch((err) => console.error("Error sending email:", err));
