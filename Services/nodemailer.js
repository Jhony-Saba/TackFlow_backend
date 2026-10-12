const nodemailer = require("nodemailer");
const authEmail=process.env.EMAIL_ACCOUNT;
const pass=process.env.EMAIL_PASSWORD;

/**Create a transporter using SMTP*/
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: authEmail,
    pass: pass,
  },
   tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;