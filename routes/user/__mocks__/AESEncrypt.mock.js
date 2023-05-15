const CryptoJS = require("crypto-js");

const ASEEncryptPassword = (password) => {
  const data = JSON.parse(JSON.stringify(password));
  let encrypted = CryptoJS.AES.encrypt(data, process.env.LOGIN_SECRET_KEY);
  return encrypted.toString();
};

module.exports = ASEEncryptPassword;
