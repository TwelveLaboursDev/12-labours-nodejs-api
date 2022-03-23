require('dotenv').config();

const db = require("../config/db");
db.connect();

class Institution {
  
  async getAll(){
    const query=
      `select institution_id as value, institution_name as display  from institutions order by institution_name`;
    let results = await db.query(query).catch(console.log);
    return results.rows;
  }

}
db.end;

module.exports=Institution;