const db = require("../config/db");

class Hospital {
  async getHospitals() {
    let { rows } = await db
      .query(
        `SELECT hospital_id AS value, hospital_name AS display 
        FROM hospitals 
        ORDER BY hospital_name`
      )
      .catch((err) => console.log(err.stack));
    return rows;
  }
}

module.exports = Hospital;
