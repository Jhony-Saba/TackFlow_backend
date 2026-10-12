
const asyncHandler = require("express-async-handler");
const message = require("../lib/emails/messages");
const temStorage= require("../Services/tempStorage")
const transporter = require('../Services/nodemailer');
const send_verification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    if (await transporter.verify()) {
      console.log("SMTP connection successful");
      await transporter.sendMail(message.messageVerification(email, temStorage.create(email)));
    } else {
      console.error("Failed to verify SMTP connection");
      res.status(500);
    }
  } catch (err) {
    console.error("Full error:");
    console.error(err);
    console.error(err.stack);
    res.status(500);
  }

  res.status(200).json({
    message: "the email was send it",
  });
});

const verify_code= asyncHandler(async(req,res)=>{
const {email,otp}=req.body;
if(temStorage.verify(email,otp)){
  res.status(200).json({})
}else{
  res.status(400).json({message:"Invalide code"});
}

})
module.exports = {
  send_verification,
  verify_code,
};
