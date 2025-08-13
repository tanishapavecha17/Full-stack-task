
const nodemailer = require("nodemailer");
require("dotenv").config();


const sendPasswordEmail = async (to, firstName, token) => {
  // 1. Build the dynamic link and HTML content *inside* the function
  const setPasswordLink = `${process.env.CLIENT_URL}/api/set-password/${token}`;
  
  const emailContent = `
    <h3>Hello ${firstName},</h3>
    <p>Welcome! Please click the link below to set your password:</p>
    <a href="${setPasswordLink}" style="background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Set Your Password</a>
    <p>This link will expire in 1 hour.</p>
  `;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  
  const mailOptions = {
    from: `"Your App Name" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Complete Your Registration",
    html: emailContent,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("Password setup email sent successfully:", result.messageId);
    return result;
  } catch (error) {
    console.error("Email sending failed:", error);
   
    throw new Error("Failed to send password setup email.");
  }
};

module.exports = {
  sendPasswordEmail,
};