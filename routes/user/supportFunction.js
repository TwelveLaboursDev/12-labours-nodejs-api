let {
  subjectTemplate,
  textTemplate,
  htmlTemplate,
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
      return res.status(409).json({ message: "Email already exists" });
    }

    const newUserId = await userObj.createUser(userInfo, strategy);
    if (!newUserId)
      return res
        .status(404)
        .json({ message: "An error occured while creating user. Try again." });

    req.newUserId = newUserId;
    next();
  } catch (err) {
    console.log(err);
  }
}

async function askToConfirm(userId, userEmail) {
  try {
    const tokenExpiry = "2 days"; //2 days
    const token = signUserToken(userId, userEmail, tokenExpiry);

    const verifyURL = `${process.env.USER_VERIFY_URL}/${token}`;
    const htmlBody = htmlTemplate
      .replace("[confirmLink]", verifyURL)
      .replace("[tokenExpiry]", tokenExpiry);
    const textBody = textTemplate
      .replace("[confirmLink]", verifyURL)
      .replace("[tokenExpiry]", tokenExpiry);
    const smtpObj = new SmtpSender(
      userEmail,
      subjectTemplate,
      textBody,
      htmlBody
    );
    return await smtpObj.sendEmail();
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

module.exports = {
  addNewUser,
  askToConfirm,
  validateInput,
};
