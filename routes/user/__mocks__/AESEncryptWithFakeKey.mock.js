const CryptoJS = require("crypto-js");

const fakeASEEncryptPassword = (password) => {
  const data = JSON.parse(JSON.stringify(password));
  let encrypted = CryptoJS.AES.encrypt(data, process.env.LOGIN_API_KEY);
  return encrypted.toString();
};

module.exports = fakeASEEncryptPassword;
