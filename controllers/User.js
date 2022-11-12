const db = require("../config/db");

class User {
  async authenticateLocal(email, password) {
    let { rowCount, rows } = await db
      .query(
        `SELECT u.user_id 
        FROM users u 
        INNER JOIN local_users lu ON u.user_id=lu.user_id
        WHERE lower(u.email)=lower('${email}') AND lu.password='${password}' AND lu.is_active=true`
      )
      .catch((err) => console.log(err.stack));
    return rowCount == 1 ? rows[0] : null;
  }

  async authenticateGoogle(email, googleId) {
    const query = `select u.user_id as user_id from users u inner join google_users gu ON u.user_id=gu.user_id
      where lower(u.email)=lower('${email}') and gu.google_id='${googleId}'`;
    let results = await db.query(query).catch(console.log);
    return results.rowCount == 1 ? results.rows[0] : null;
  }

  async createUser(userInfo, strategy) {
    const query = `insert into users (type_id, email, title, first_name, last_name,profession,institution_id,hpi,hospital_id,nhi,dhb_id,created)
      select ut.type_id,'${userInfo.email}','${userInfo.title}','${
      userInfo.firstName
    }','${userInfo.lastName}','${userInfo.profession}',${
      userInfo.institutionId
    },'${userInfo.hpi}',${userInfo.hospitalId},'${userInfo.nhi}',${
      userInfo.dhbId
    },Now()
      from user_types ut where LOWER(ut.type_name)='${userInfo.userTypeName.toLowerCase()}'`;
    let results = await db.query(query).catch(console.log);
    if (results.rowCount != 1) return null;

    let newUser = await db
      .query(
        `select user_id from users where lower(email)=lower('${userInfo.email}')`
      )
      .catch(console.log);
    const newUserId = newUser.rows[0].user_id;
    const query2 =
      strategy === "local"
        ? `insert into local_users (user_id, password, is_Active,created)
        values (${newUserId},'${userInfo.password}',false,Now())`
        : `insert into google_users (user_id, google_id,created)
      values (${newUserId},'${userInfo.googleId}',Now())`;
    let results2 = await db.query(query2).catch(console.log);
    return results2.rowCount == 1 ? newUserId : null;
  }

  async localUserExists(email) {
    const query = `select lu.user_id as user_id,is_active
    from users u inner JOIN local_users lu on u.user_id=lu.user_id
    where LOWER(email)='${email.toLowerCase()}'`;

    //console.log(query)
    let results = await db.query(query).catch(console.log);
    return results.rowCount > 0 ? results.rows[0] : null;
  }

  async emailExists(email) {
    const query = `select user_id from users where LOWER(email)='${email.toLowerCase()}'`;
    let results = await db.query(query).catch(console.log);
    return results.rowCount == 1 ? true : false;
  }

  async activateLocal(userId) {
    const query = `update local_users set is_Active=true, updated=Now() where user_id=${userId}`;
    let results = await db.query(query).catch(console.log);
    //console.log(results);
    return results.rowCount == 1;
  }

  async getProfileById(userId) {
    // "rowCount"
    // The number of rows processed by the last command
    // Use to determine if the query is valid
    let { rowCount, rows } = await db
      .query(
        `SELECT user_id, type_name, email, title, first_name, last_name, profession, u.institution_id AS institution_id, institution_name, nhi, hpi, u.dhb_id AS dhb_id, dhb_name, u.hospital_id AS hospital_id, hospital_name
        FROM users u 
        INNER JOIN user_types ut ON u.type_id=ut.type_id
        LEFT JOIN institutions i ON u.institution_id=i.institution_id
        LEFT JOIN dhbs d ON u.dhb_id=d.dhb_id
        LEFT JOIN hospitals h ON u.hospital_id=h.hospital_id
        WHERE user_id=${userId}`
      )
      .catch((err) => console.log(err.stack));
    return rowCount == 1 ? rows[0] : null;
  }

  async changePassword(userId, oldPassword, newPassword) {
    let { rowCount } = await db
      .query(
        `UPDATE local_users 
        SET password='${newPassword}', updated=Now() 
        WHERE user_id=${userId} and password='${oldPassword}'`
      )
      .catch((err) => console.log(err.stack));
    return rowCount == 1;
  }

  async deleteUser(userId) {
    let { rowCount } = await db
      .query(
        `DELETE FROM users 
        WHERE user_id=${userId}`
      )
      .catch((err) => console.log(err.stack));
    return rowCount == 1;
  }
}

module.exports = User;
