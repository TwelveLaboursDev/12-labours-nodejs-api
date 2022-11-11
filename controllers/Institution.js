const db = require("../config/db");

class Institution {
  async getInstitutions() {
    let { rows } = await db
      .query(
        `SELECT institution_id AS value, institution_name AS display 
        FROM institutions 
        ORDER BY institution_name`
      )
      .catch((err) => console.log(err.stack));
    return rows;
  }
}

module.exports = Institution;
