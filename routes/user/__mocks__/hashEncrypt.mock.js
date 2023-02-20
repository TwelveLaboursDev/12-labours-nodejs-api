const bcrypt = require("bcrypt");

const hashEncryptPassword = (password) => {
  const saltRounds = 12;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

module.exports = hashEncryptPassword;
