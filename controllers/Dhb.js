require('dotenv').config();

const db = require("../config/db");
db.connect();

class Dhb {
  
  async getNorth(){
    const query=
      `select dhb_id as value, dhb_name as display from dhbs where island='North'`;
    let results = await db.query(query).catch(console.log);
    return results.rows;
  }

  async getSouth(){
    const query=
      `select dhb_id as value, dhb_name as display from dhbs where island='South'`;
    let results = await db.query(query).catch(console.log);
    return results.rows;
  }

}

db.end;

module.exports=Dhb;