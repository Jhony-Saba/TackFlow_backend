const nodemailer = require("nodemailer");
const {accessToken}=require ('./googleapis');

const email =process.env.EMAIL;
const clientId= process.env.CLIENT_ID;
const clientSecret=process.env.CLIENT_SECRET;
const refreshToken= process.env.REFRESH_TOKEN;



/**Create a transporter using google Apis
 * @returns {Promise} tranporter
*/
async function createTransporter() {
  const token = await accessToken();
const transporter = nodemailer.createTransport({ 
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: email,
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        accessToken: token,
      },
  tls: {
    rejectUnauthorized: false,
  },
    });
  
    return transporter;
  }

module.exports = {
  createTransporter,
};