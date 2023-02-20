const express = require("express");
const {
  verifyToken,
  signUserToken,
  verifyClient,
} = require("../../middleware/auth");
const {
  askToConfirm,
  validateInput,
  resetForgottenPassword,
  AESDecrypt,
  hashEncrypt,
  decryptCompare,
} = require("./supportFunction");

function localUserRouter(localUserObject) {
  const router = express.Router();

  router.post("/user/local/register", verifyClient, async (req, res) => {
    try {
      const { userInfo, strategy } = req.body;

      if (
        !userInfo ||
        !userInfo.email ||
        !userInfo.password ||
        !userInfo.firstName ||
        !userInfo.lastName ||
        !userInfo.title
      ) {
        return res.status(400).json({ message: "User Information is missing" });
      }

      const decryptedPassword = AESDecrypt(userInfo.password);
      if (
        !validateInput(userInfo.firstName) ||
        !validateInput(userInfo.lastName) ||
        !validateInput(decryptedPassword)
      ) {
        return res
          .status(400)
          .json({ message: "Invalid symbols are included" });
      }

      if (await localUserObject.emailExists(userInfo.email)) {
        return res.status(409).json({ message: "Email already exists" });
      }

      userInfo.password = hashEncrypt(decryptedPassword);
      const newUserId = await localUserObject.createUser(userInfo, strategy);
      if (!newUserId) {
        return res.status(404).json({
          message: "An error occurred while creating user. Try again.",
        });
      }

      const sendStatus = await askToConfirm(newUserId, userInfo.email);
      res.status(200).send({ email: userInfo.email, emailSent: sendStatus });
    } catch (err) {
      console.log(err);
    }
  });

  router.post("/user/local/email", verifyClient, async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(404).json({ message: "Email not provided" });
      }

      const user = await localUserObject.localUserExists(email);
      if (!user) {
        return res
          .status(400)
          .json({ message: "Invalid user, please register a new account." });
      }

      if (user.is_active) {
        res.status(200).send({ alreadyActive: true });
      } else {
        const sendStatus = await askToConfirm(user.user_id, email);
        res.status(200).send({ emailSent: sendStatus, email: email });
      }
    } catch (err) {
      console.log(err);
    }
  });

  router.post(
    "/user/local/confirm",
    verifyClient,
    verifyToken,
    async (req, res) => {
      const { emailFromToken, idFromToken, tokenStatus } = req;

      const user = await localUserObject.localUserExists(emailFromToken);
      if (!user || user.user_id != idFromToken) {
        return res
          .status(400)
          .json({ message: "Invalid user, please register a new account." });
      }

      if (user.is_active) {
        return res.status(200).send({ alreadyActive: true });
      } else {
        if (tokenStatus == "expired") {
          const sendStatus = await askToConfirm(user.user_id, emailFromToken);
          return res.status(400).json(
            sendStatus
              ? {
                  message:
                    "Your verification has expired. A new email with confirmation link has been sent to your inbox.",
                }
              : {
                  message: "Unexpected error occurred. Try again later.",
                }
          );
        } else {
          if (await localUserObject.activateLocal(user.user_id)) {
            res.status(200).send("OK");
          } else {
            return res
              .status(400)
              .json({ message: "Unexpected error occurred. Try again later." });
          }
        }
      }
    }
  );
  router.post("/user/local/login", verifyClient, async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Provide email and password" });
      }

      const decryptedPassword = AESDecrypt(password);
      if (!validateInput(email) || !validateInput(decryptedPassword)) {
        return res
          .status(400)
          .json({ message: "Invalid symbols are included" });
      }

      const dbPassword = await localUserObject.queryDbPassword("email", email);
      if (decryptCompare(decryptedPassword, dbPassword)) {
        const userFound = await localUserObject.authenticateLocal(email);
        if (!userFound) {
          return res.status(403).json({
            message: "User with specified email/password was not found",
          });
        }
        const user = await localUserObject.getProfileById(userFound.user_id);
        const token = signUserToken(user.user_id, user.email);
        res.status(200).send({ user: user, access_token: token });
      } else {
        return res.status(404).json({
          message: "The password does not match the account",
        });
      }
    } catch (err) {
      console.log(err);
    }
  });

  router.get("/user/local/profile", verifyToken, async (req, res) => {
    try {
      if (req.tokenStatus == "expired") {
        return res.status(401).json({ message: "Token expired" });
      }

      const user = await localUserObject.getProfileById(req.idFromToken);
      if (user) {
        res.status(200).send({ user: user });
      } else {
        return res.status(403).json({ message: "User not found" });
      }
    } catch (err) {
      console.log(err);
    }
  });

  router.post("/user/local/profile/update", verifyToken, async (req, res) => {
    try {
      const { userInfo } = req.body;

      if (req.tokenStatus == "expired") {
        return res.status(401).json({ message: "Token expired" });
      }

      if (!userInfo) {
        return res.status(400).json({ message: "User information is missing" });
      }

      if (!(await localUserObject.emailExists(userInfo.email))) {
        return res.status(400).json({ message: "Email does not exist" });
      }

      if (!(await localUserObject.getProfileById(userInfo.userId))) {
        return res.status(400).json({ message: "Invalid user id provided" });
      }

      if (await localUserObject.updateUserInfo(userInfo)) {
        // Get the latest user information
        const user = await localUserObject.getProfileById(userInfo.userId);
        res.status(200).send({ user: user });
      } else {
        return res
          .status(403)
          .json({ message: "Your request can not be completed. Try again." });
      }
    } catch (err) {
      console.log(err);
    }
  });

  router.post("/user/local/password", verifyToken, async (req, res) => {
    try {
      const { userId, newPassword, oldPassword, reset } = req.body;

      if (!userId || !newPassword || !oldPassword) {
        return res
          .status(404)
          .json({ message: "Incomplete data was provided" });
      }

      const decryptedNewPassword = AESDecrypt(newPassword);
      const decryptedOldPassword = AESDecrypt(oldPassword);
      if (!validateInput(decryptedNewPassword)) {
        return res
          .status(400)
          .json({ message: "Invalid symbols are included" });
      }

      if (req.tokenStatus != "valid" || userId != req.idFromToken) {
        return res.status(401).json({ message: "Authentication failed" });
      }

      const dbPassword = await localUserObject.queryDbPassword("id", userId);
      if (reset || decryptCompare(decryptedOldPassword, dbPassword)) {
        if (
          await localUserObject.changePassword(
            userId,
            hashEncrypt(decryptedNewPassword)
          )
        ) {
          const user = await localUserObject.getProfileById(userId);
          res.status(200).send(reset ? { email: user.email } : "OK");
        } else {
          return res.status(403).json({
            message: "Your request can not be authenticated. Try again.",
          });
        }
      } else {
        return res.status(404).json({
          message: "The password does not match the account",
        });
      }
    } catch (err) {
      console.log(err);
    }
  });

  router.post("/user/local/password/reset", verifyClient, async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Required email is missing" });
      }

      const user = await localUserObject.localUserExists(email);
      if (!user) {
        return res
          .status(404)
          .json({ message: "The email has not been registered" });
      }

      if (!user.is_active) {
        const sendStatus = await askToConfirm(user.user_id, email);
        return res.status(403).json({
          message: `The email has not been activated. ${
            sendStatus
              ? `Confirm email has been sent to ${email}`
              : "Sending email failed. Try again later."
          }`,
        });
      }

      if (await resetForgottenPassword(user.user_id, email)) {
        res.status(200).send({ message: `Email has been sent to ${email}` });
      } else {
        return res.status(403).json({
          message: "Sending email failed. Try again later.",
        });
      }
    } catch (err) {
      console.log(err);
    }
  });

  router.post("/user/local/delete", verifyToken, async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res
          .status(404)
          .json({ message: "Incomplete data was provided" });
      }

      if (req.tokenStatus == "expired" || userId != req.idFromToken) {
        return res.status(401).json({ message: "Authentication failed" });
      }

      if (await localUserObject.deleteUser(userId)) {
        res.status(200).send("OK");
      } else {
        return res
          .status(403)
          .json({ message: "Your request can not be completed. Try again." });
      }
    } catch (err) {
      console.log(err);
    }
  });
  return router;
}

module.exports = localUserRouter;
