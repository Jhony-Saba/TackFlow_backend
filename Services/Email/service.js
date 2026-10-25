
const asyncHandler = require("express-async-handler");
const message = require("./messages");
const temStorage= require("../Otp/tempStorage")
const transporter = require('./nodemailer');
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
  

  try {
    if (await transporter.verify()) {
      console.log("SMTP connection successful");
      await transporter.sendMail(message.messageVerification(email, temStorage.create(email)));
    } else {
      console.error("Failed to verify SMTP connection");
     
       return false
    }
  } catch (err) {
    console.error("Full error:");
    console.error(err);
    console.error(err.stack);
    return false
  }

 return true;
});
/** 
 * @param {string} email
 * @param {number}enteredOtp 
 * @return {boolean}  
 * 
 * */
const verify_code= asyncHandler(async(email,enteredOtp)=>{
return temStorage.verify(email,enteredOtp);});
module.exports = {
  send_verification,
  verify_code,
};
