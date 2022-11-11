const db = require("../config/db");

class Identity {
  async getIdentities() {
    let { rows } = await db
      .query(
        `SELECT type_id AS value, type_name AS display 
        FROM user_types`
      )
      .catch((err) => console.log(err.stack));
    return rows;
  }
}

module.exports = Identity;
