const { google } = require("googleapis");


const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const accessToken = async () => {
  const result = await oAuth2Client.getAccessToken();

  if (!result.token) {
    throw new Error("Failed to obtain Google access token");
  }

  return result.token;
};

module.exports = {
accessToken,
};