
const asyncHandler = require("express-async-handler");
const message = require("./messages");
const temOtp= require("../Otp/tempStorage")
const {createTransporter} = require('./nodemailer');
const { gmail } = require("./googleapis");

/**
 * Sends an email verification code (OTP) to the specified email address.
 *
 * Workflow:
 * 1. Verify that the SMTP server connection is available.
 * 2. Generate a One-Time Password (OTP).
 * 3. Store the generated OTP in temporary storage.
 * 4. Send the verification email containing the OTP.
 * 5. Return the operation result.
 *
 * @async
 *
 * @param {string} email - The email address that will receive the verification code.
 *
 * @returns {Boolean}
 * Returns:
 * - true if the verification email was sent successfully.
 * - false if an error occurred while sending the email.
 *
 * @throws {Error} If the SMTP server is unavailable.
 * @throws {Error} If the email could not be sent.
 *
 * @example
 * const success = await send_verification("john@example.com");
 *
 * if (success) {
 *   console.log("Verification email sent.");
 * }
 */
const send_verification = asyncHandler(async (email) => {
  
 const transporter = await createTransporter();
  try { 
     const info = await transporter.sendMail(message.messageVerification(email, temOtp.create(email)));
     const raw = info.message
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");


        const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw },
    });
    console.log(response.data);
       if (response.data && response.data.id) {
    console.log("✅ Email sent successfully!");
    return {
      success: true,
      messageId: response.data.id,
    };
  }


   console.error("❌ Gmail did not return a message ID");

  return {
    success: false,
    messageId: null,
  };

  
  }catch (err) {
    console.error("❌ Failed to send email");
  console.error("Error:", err.message);
  console.error("Status:", err.response?.status);
  console.error("Details:", err.response?.data);

  return {
    success: false,
    messageId: null,
  };
  }finally{
      transporter.close();
  }


});
/** 
 * @param {string} email
 * @param {number}enteredOtp 
 * @return {boolean}  
 * 
 * */
const verify_code= asyncHandler(async(email,enteredOtp)=>{
return temOtp.verify(email,enteredOtp);});
module.exports = {
  send_verification,
  verify_code,
};
