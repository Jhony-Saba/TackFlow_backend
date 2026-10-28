const authEmail = process.env.EMAIL;
/**
 * Message template for user verification
 * @param {string} email
 * @param {number} otp
 * @returns {object}
 */
const messageVerification = (email, otp) => ({
  from:`<TaskFlow> ${authEmail}`,
  to: email,
  subject: "Verify Your Email Address",
  text: `
Hello,

Thank you for registering with us.

To complete the verification of your email address, please use the following verification code:

${otp}

This code will expire in 10 minutes.

If you did not request this verification, please ignore this email.

Best regards,
The Support Team
  `,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Email Verification</h2>

      <p>Hello,</p>

      <p>
        Thank you for registering with us. To verify your email address,
        please use the verification code below:
      </p>

      <div style="
        background: #f4f4f4;
        padding: 15px;
        text-align: center;
        border-radius: 8px;
        margin: 20px 0;
      ">
        <span style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 6px;
          color: #2563eb;
        ">
          ${otp}
        </span>
      </div>

      <p>
        This code will expire in <strong>10 minutes</strong>.
      </p>

      <p>
        If you did not request this verification, you can safely ignore this email.
      </p>

      <p>
        Best regards,<br />
        <strong>The Support Team</strong>
      </p>
    </div>
  `,
});
module.exports = {
  messageVerification,
};