const nodemailer = require("nodemailer");
require("dotenv").config();
const authEmail = process.env.EMAIL_ACCOUNT;
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: authEmail,
    pass: process.env.EMAIL_PASSWORD,
  },
});

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

const send_verification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const verificationCode = generateVerificationCode();

    await transporter.sendMail({
      from:`TaskFlow <${authEmail}>`,
      to: email,
      subject: "Email Verification",
      html: `
        <h2>Email Verification</h2>
        <p>Your verification code is:</p>
        <h1>${verificationCode}</h1>
        <p>This code expires in 10 minutes.</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Verification code sent",
      code: verificationCode,
    });
  } catch (error) {
    console.error("Failed to send verification email:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
};

module.exports = {
  send_verification,
};