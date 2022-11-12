const db = require("../config/db");

class User {
  async authenticateLocal(email, password) {
    let { rowCount, rows } = await db
      .query(
        `SELECT u.user_id 
        FROM users u 
        INNER JOIN local_users lu ON u.user_id=lu.user_id
        WHERE LOWER(u.email)='${email.toLowerCase()}' AND lu.password='${password}' AND lu.is_active=true`
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
    // "INSERT INTO SELECT"
    // Copy type_id from user_types table and insert it into users table
    let userResult = await db
      .query(
        `INSERT INTO users (type_id, email, title, first_name, last_name, profession, institution_id, hpi, hospital_id, nhi, dhb_id, created)
        SELECT ut.type_id, '${userInfo.email}', '${userInfo.title}', '${
          userInfo.firstName
        }', '${userInfo.lastName}', '${userInfo.profession}', ${
          userInfo.institutionId
        }, '${userInfo.hpi}', ${userInfo.hospitalId}, '${userInfo.nhi}', ${
          userInfo.dhbId
        }, Now()
        FROM user_types ut 
        WHERE LOWER(ut.type_name)='${userInfo.userTypeName.toLowerCase()}'`
      )
      .catch((err) => console.log(err.stack));

    // Return null if the data does not insert register into the table successfully
    if (userResult.rowCount != 1) {
      return null;
    }

    // Use to query the generated user id
    let { rows } = await db
      .query(
        `SELECT user_id 
        FROM users 
        WHERE lower(email)='${userInfo.email.toLowerCase()}'`
      )
      .catch((err) => console.log(err.stack));
    const newUserId = rows[0].user_id;

    // Insert user data into the local/google user table
    let platformResult = await db
      .query(
        strategy === "local"
          ? `INSERT INTO local_users (user_id, password, is_active, created)
            VALUES (${newUserId}, '${userInfo.password}', false, Now())`
          : `INSERT INTO google_users (user_id, google_id, created)
            VALUES (${newUserId}, '${userInfo.googleId}', Now())`
      )
      .catch((err) => console.log(err.stack));
    return platformResult.rowCount == 1 ? newUserId : null;
  }

  async localUserExists(email) {
    let { rowCount, rows } = await db
      .query(
        `SELECT lu.user_id AS user_id, is_active
        FROM users u INNER JOIN local_users lu ON u.user_id=lu.user_id
        WHERE LOWER(email)='${email.toLowerCase()}'`
      )
      .catch((err) => console.log(err.stack));
    return rowCount > 0 ? rows[0] : null;
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
