require('dotenv').config();
const SECRET_KEY=process.env.SECRET_KEY
const {clientId, clientSecret, redirectUri } = require('../config/google')

const {OAuth2Client} = require('google-auth-library');
const googleClient = new OAuth2Client(clientId,clientSecret,redirectUri);

const jwt = require("jsonwebtoken");

function signUserToken (id,email,expiry) {  
  //Strings to set expiry: "120s", "2 days", "10h", "7d" 
  const expiryTime= expiry ? expiry : '1200s'  //20 minutes default expiry time 

  return jwt.sign(
    {idFromToken: id, emailFromToken: email},
    SECRET_KEY,
    {expiresIn:expiryTime}
  )
}

function verifyToken(req, res, next) {
  let rawToken = req.get('Authorization') || req.headers['Authorization'];

  if (!rawToken || !rawToken.split(' ')[1]) 
    return res.status(404).json({message:'A valid token is required for authentication'});

  const token=rawToken.split(' ')[1]; 
  
  jwt.verify(token, SECRET_KEY,(err, payload)=> {
    if(err){
      if(err.name === 'TokenExpiredError'){
        const payloadExpired = jwt.verify(token, SECRET_KEY, {ignoreExpiration: true} );
        req.tokenStatus='expired'
        req.idFromToken=payloadExpired.idFromToken;
        req.emailFromToken=payloadExpired.emailFromToken;
      }
      else{
        return res.status(401).json({message:'Unauthorized request'});
      }
    }
    else{
      req.tokenStatus='valid'
      req.idFromToken=payload.idFromToken;
      req.emailFromToken=payload.emailFromToken;
    }
    next();
  });
}


async function getGoogleToken(req, res, next) {
  const googleCode=req.body.code;
  console.log(googleCode);
  console.log('--------')
  if(!googleCode)
    return res.status(400).send("Invalid request. Google code not provided");

  googleClient.getToken(googleCode, function (err, tokenInfo) {
    if (err)
      //return res.status(403).send(JSON.stringify(err));   ///res avaialble????? retutrn????
      console.log(JSON.stringify(err))

    verifyGoogleToken(tokenInfo.id_token).catch(console.error);

    req.access_token=tokenInfo.access_token;
  })

  next();
}

async function verifyGoogleToken(token) {
  const ticket = await googleClient.verifyIdToken({
    idToken: token,
    audience: clientId
  });
  const payload = ticket.getPayload();
  //const userid = payload['sub'];
  console.log(payload)
  //return payload;
}

module.exports = {verifyToken,getGoogleToken,signUserToken};