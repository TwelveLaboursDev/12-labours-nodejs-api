const bcrypt = require("bcrypt");
const crypto = require("crypto-js");
let {
  verifyHTMLTemplate,
  verifyTextTemplate,
  verifySubjectTemplate,
  resetHTMLTemplate,
  resetTextTemplate,
  resetSubjectTemplate,
} = require("../../middleware/message");
const { signUserToken } = require("../../middleware/auth");
const SmtpSender = require("../../middleware/smtp");
const User = require("../../controllers/User");

async function addNewUser(req, res, next) {
  try {
    const { userInfo, strategy } = req.body;

    if (
      !userInfo ||
      !userInfo.email ||
      !userInfo.firstName ||
      !userInfo.lastName ||
      !userInfo.title
    )
      return res.status(400).json({ message: "User Information is missing" });

    const userObj = new User();
    if (await userObj.emailExists(userInfo.email)) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUserId = await userObj.createUser(userInfo, strategy);
    if (!newUserId) {
      return res
        .status(404)
        .json({ message: "An error occurred while creating user. Try again." });
    }

    req.newUserId = newUserId;
    next();
  } catch (err) {
    console.log(err);
  }
}

async function askToConfirm(userId, userEmail) {
  try {
    const tokenExpiry = "2 days";
    const token = signUserToken(userId, userEmail, "2d");
    const verifyURL = `${process.env.USER_VERIFY_URL}/${token}`;

    const htmlBody = verifyHTMLTemplate
      .replace("[confirmLink]", verifyURL)
      .replace("[tokenExpiry]", tokenExpiry);
    const textBody = verifyTextTemplate
      .replace("[confirmLink]", verifyURL)
      .replace("[tokenExpiry]", tokenExpiry);
    const smtpObj = new SmtpSender(
      userEmail,
      verifySubjectTemplate,
      textBody,
      htmlBody
    );
    return await smtpObj.sendEmail();
    //return true;
  } catch (err) {
    console.log(err);
  }
}

async function resetForgottenPassword(userId, userEmail) {
  try {
    const tokenExpiry = "2 hours";
    const token = signUserToken(userId, userEmail, "2h");
    const resetURL = `${process.env.PASSWORD_RESET_URL}/${token}/${userId}`;

    const htmlBody = resetHTMLTemplate
      .replace("[resetLink]", resetURL)
      .replace("[tokenExpiry]", tokenExpiry);
    const textBody = resetTextTemplate
      .replace("[resetLink]", resetURL)
      .replace("[tokenExpiry]", tokenExpiry);

    const smtpObj = new SmtpSender(
      userEmail,
      resetSubjectTemplate,
      textBody,
      htmlBody
    );
    return await smtpObj.sendEmail();
    //return true;
  } catch (err) {
    console.log(err);
  }
}

function validateInput(input) {
  if (input.includes("'") || input.includes('"') || input.includes("`")) {
    return false;
  }
  return true;
}

function hashEncrypt(password) {
  const saltRounds = 12;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}
function decryptCompare(password, hash) {
  const compare = bcrypt.compareSync(password, hash);
  return compare;
}

module.exports = {
  addNewUser,
  askToConfirm,
  validateInput,
  resetForgottenPassword,
  hashEncrypt,
  decryptCompare,
};
