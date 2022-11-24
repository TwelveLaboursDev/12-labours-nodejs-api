const db = require("../config/db");

class Dhb {
  async getNorthDhbs() {
    let { rows } = await db
      .query(
        `SELECT dhb_id AS value, dhb_name AS display 
        FROM dhbs 
        WHERE island='North'`
      )
      .catch((err) => console.log(err.stack));
    return rows;
  }

  async getSouthDhbs() {
    let { rows } = await db
      .query(
        `SELECT dhb_id AS value, dhb_name AS display 
        FROM dhbs 
        WHERE island='South'`
      )
      .catch((err) => console.log(err.stack));
    return rows;
  }
}

module.exports = Dhb;
