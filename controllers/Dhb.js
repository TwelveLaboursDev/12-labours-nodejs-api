const db = require("../config/db");

async function getNorthDhbs() {
  let { rows } = await db
    .query(
      `SELECT dhb_id AS value, dhb_name AS display 
      FROM dhbs 
      WHERE island='North'`
    )
    .catch((err) => console.log(err.stack));
  return rows;
}

async function getSouthDhbs() {
  let { rows } = await db
    .query(
      `SELECT dhb_id AS value, dhb_name AS display 
      FROM dhbs 
      WHERE island='South'`
    )
    .catch((err) => console.log(err.stack));
  return rows;
}

module.exports = { getNorthDhbs, getSouthDhbs };
