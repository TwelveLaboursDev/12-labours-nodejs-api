require('dotenv').config();

const db = require("../config/db");
db.connect();

class Hospital {
  
  async getAll(){
    const query=
      `select hospital_id as value, hospital_name as display  from hospitals order by hospital_name`;
    let results = await db.query(query).catch(console.log);
    return results.rows;
  }

}
db.end;

module.exports=Hospital;