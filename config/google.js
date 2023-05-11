const googleCredentials = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URL,
};

//tokenApi='https://oauth2.googleapis.com/token'

module.exports = googleCredentials;
