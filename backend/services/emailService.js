const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, 
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS, 
  },
});

const sendEmail = async ({ to, subject, text }) => {
  try {
    const fromAddress = `Meeting Scheduler <${process.env.SMTP_USER}>`;

    await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text,
    });
    console.log(`Email sent successfully to ${to} via Gmail.`);
  } catch (error)
  {
    console.error(`Error sending email via Gmail to ${to}:`, error);
  }
};

module.exports = { sendEmail };