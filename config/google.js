
const googleCredentials={
  clientId:process.env.GOOGLE_CLIENT_ID,
  clientSecret:process.env.GOOGLE_CLIENT_SECRET,
  redirectUri:'http://localhost:3000/login'
}

//tokenApi='https://oauth2.googleapis.com/token'

module.exports=googleCredentials;