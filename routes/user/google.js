const express = require("express");
const {
  getGoogleToken,
  signUserToken,
  verifyClient,
} = require("../../middleware/auth");
const { addNewUser } = require("./supportFunction");

function googleUserRouter(googleUserObject) {
  const router = express.Router();

  router.post("/user/google/login", getGoogleToken, async (req, res) => {
    try {
      const { email, googleId } = req.googleProfile;

      const userFound = await googleUserObject.authenticateGoogle(
        email,
        googleId
      );
      if (userFound) {
        const token = signUserToken(userFound.user_id, email, "2h");
        res.status(200).send({ access_token: token });
      } else {
        res
          .status(200)
          .send({ createAccount: true, googleProfile: req.googleProfile });
      }
    } catch (err) {
      console.log(err);
    }
  });

  router.post(
    "/user/google/register",
    verifyClient,
    addNewUser,
    async (req, res) => {
      try {
        const userId = req.newUserId;
        const user = await googleUserObject.getProfileById(userId);
        if (user) {
          const token = signUserToken(user.user_id, user.email, "2h");
          res.status(200).send({ user: user, access_token: token });
        } else {
          return res.status(404).json({
            message: "An error occurred while creating user. Try again.",
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  );

  router.delete("/user/google/delete", (req, res) => {
    //revokeGoogleAccount();
  });
  return router;
}

module.exports = googleUserRouter;
