require("dotenv").config();
const SECRET_KEY = process.env.LOGIN_SECRET_KEY;
const API_KEY = process.env.LOGIN_API_KEY;

const { clientId, clientSecret, redirectUri } = require("../config/google");

const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(clientId, clientSecret, redirectUri);

const jwt = require("jsonwebtoken");

// Used to generate the access token
// The token will be used in login and activate the account
function signUserToken(id, email, expiry) {
  //Strings to set expiry: "1200s", "10h", "7d"
  const expiryTime = expiry ? expiry : "1200s"; //20 minutes default expiry time

  return jwt.sign({ idFromToken: id, emailFromToken: email }, SECRET_KEY, {
    expiresIn: expiryTime,
  });
}

function verifyToken(req, res, next) {
  let rawToken = req.get("access_token") || req.headers["access_token"];
  if (!rawToken || !rawToken.split(" ")[1]) {
    return res
      .status(404)
      .json({ message: "A valid token is required for authentication" });
  }

  const token = rawToken.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, payload) => {
    if (err) {
      if (err.name == "TokenExpiredError") {
        payload = jwt.verify(token, SECRET_KEY, { ignoreExpiration: true });
        req.tokenStatus = "expired";
      } else {
        return res.status(401).json({ message: "Unauthorized request" });
      }
    }

    req.tokenStatus = "valid";
    req.idFromToken = payload.idFromToken;
    req.emailFromToken = payload.emailFromToken;
    next();
  });
}

async function getGoogleToken(req, res, next) {
  try {
    const googleCode = req.body.code;
    if (!googleCode) {
      return res
        .status(400)
        .json({ message: "Invalid request. Google code not provided" });
    }

    const { tokens } = await googleClient.getToken(googleCode);
    const payload = await verifyGoogleIdToken(tokens.id_token);
    if (!payload) {
      return res.status(403).json({ message: "Authentication failed" });
    }

    req.googleProfile = {
      email: payload.email,
      googleId: payload.sub,
      firstName: payload.given_name,
      lastName: payload.family_name,
    };
    next();
  } catch (err) {
    return res.status(403).json({ message: "Authentication failed" });
  }
}

async function verifyGoogleIdToken(token) {
  try {
    /* There are number of ways to decode and verify token, some recommend writing your own code, to save additional network request. */
    /* But Google documentation here https://developers.google.com/identity/sign-in/web/backend-auth suggests that, 
    ...  
    Rather than writing your own code to perform these verification steps, we strongly recommend using a Google API client library for your platform.
    Using one of the Google API Client Libraries (e.g. Java, Node.js, PHP, Python) is the recommended way to validate Google ID tokens in a production environment.
    ....
    */
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: clientId,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (err) {
    console.log(err);
  }
}

// This is used to check if the web portal has the authorization to use the login system api
// Should have the same API_KEY in .env file
function verifyClient(req, res, next) {
  const keyFromClient =
    req.get("Authorization") || req.headers["Authorization"];
  if (!keyFromClient || !(keyFromClient == API_KEY)) {
    return res.status(404).json({ message: "Authentication failed" });
  }
  next();
}
module.exports = { verifyToken, getGoogleToken, signUserToken, verifyClient };
