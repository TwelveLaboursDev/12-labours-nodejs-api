const db = require("../__mocks__/db.mock");

/*
The entire testing process needs to follow the correct order,
otherwise may fail in some test cases.
*/

describe("User queries", () => {
  const userInfo = {
    userTypeName: "Researcher",
    email: "email@gmail.com",
    title: "Mr",
    firstName: "firstname",
    lastName: "lastname",
    profession: "IT",
    institutionId: 1,
    hpi: null,
    hospitalId: null,
    nhi: null,
    dhbId: null,
    password: "password",
    googleId: null,
  };

  describe("Create user", () => {
    const strategy = "local";

    test("should return rowCount==1 if data inserted successfully", async () => {
      const { rowCount } = await db.query(
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
      );
      expect(rowCount).toBe(1);
    });

    test("should return user id", async () => {
      const { rowCount, rows } = await db.query(
        `SELECT user_id 
        FROM users 
        WHERE lower(email)='${userInfo.email.toLowerCase()}'`
      );
      expect(rowCount).toBe(1);
      expect(rows[0]).toEqual({ user_id: expect.any(Number) });
    });

    test("should return rowCount==1 if data inserted successfully", async () => {
      const newUserId = 1; // Only one user will be created, hence the user id should be 1

      const { rowCount } = await db.query(
        strategy === "local"
          ? `INSERT INTO local_users (user_id, password, is_active, created)
            VALUES (${newUserId}, '${userInfo.password}', false, Now())`
          : `INSERT INTO google_users (user_id, google_id, created)
            VALUES (${newUserId}, '${userInfo.googleId}', Now())`
      );
      expect(rowCount).toBe(1);
    });
  });

  describe("Update user information", () => {
    test("should return rowCount==1 if update successfully", async () => {
      const userInfo = {
        userId: 1,
        email: "email@gmail.com",
        title: "Mr",
        firstName: "firstname",
        lastName: "lastname",
        profession: "ICT",
        institutionId: 2,
        hospitalId: 3,
        dhbId: 1,
      };

      let { rowCount } = await db.query(
        `UPDATE users
        SET title='${userInfo.title}', first_name='${
          userInfo.firstName
        }', last_name='${userInfo.lastName}', profession='${
          userInfo.profession
        }', institution_id=${userInfo.institutionId}, hospital_id=${
          userInfo.hospitalId
        }, dhb_id=${userInfo.dhbId}, updated=Now()
        WHERE user_id=${
          userInfo.userId
        } AND LOWER(email)='${userInfo.email.toLowerCase()}'`
      );
      expect(rowCount).toBe(1);
    });
  });

  describe("Check local user exists", () => {
    test("should return rowCount==1, user id and account status if exist", async () => {
      const email = userInfo.email;

      const { rowCount, rows } = await db.query(
        `SELECT lu.user_id AS user_id, is_active
        FROM users u INNER JOIN local_users lu ON u.user_id=lu.user_id
        WHERE LOWER(email)='${email.toLowerCase()}'`
      );
      expect(rowCount).toBe(1);
      expect(rows[0]).toEqual({
        user_id: expect.any(Number),
        is_active: expect.any(Boolean),
      });
    });

    test("should return rowCount==0 if not exist", async () => {
      const email = "newemail@gmail.com";

      const { rowCount, rows } = await db.query(
        `SELECT lu.user_id AS user_id, is_active
        FROM users u INNER JOIN local_users lu ON u.user_id=lu.user_id
        WHERE LOWER(email)='${email.toLowerCase()}'`
      );
      expect(rowCount).toBe(0);
      expect(rows[0]).toBeUndefined();
    });
  });

  describe("Check google user exists", () => {
    test("should return rowCount==1 and user id if exist", async () => {
      const email = "email@gmail.com"; // Assume this is a google user

      const { rowCount } = await db.query(
        `SELECT user_id 
        FROM users 
        WHERE LOWER(email)='${email.toLowerCase()}'`
      );
      expect(rowCount).toBe(1);
    });
  });

  describe("Activate account status", () => {
    test("should return rowCount==1 if activate successfully", async () => {
      const userId = 1;

      const { rowCount } = await db.query(
        `UPDATE local_users 
        SET is_active=true, updated=Now() 
        WHERE user_id=${userId}`
      );
      expect(rowCount).toBe(1);
    });
  });

  describe("Authenticate user login", () => {
    test("should return rowCount==1 and user id if login successfully", async () => {
      const email = userInfo.email;
      const password = userInfo.password;

      const { rowCount, rows } = await db.query(
        `SELECT u.user_id 
        FROM users u 
        INNER JOIN local_users lu ON u.user_id=lu.user_id
        WHERE LOWER(u.email)='${email.toLowerCase()}' AND lu.password='${password}' AND lu.is_active=true`
      );
      expect(rowCount).toBe(1);
      expect(rows[0]).toEqual({ user_id: expect.any(Number) });
    });

    test("should return rowCount==0 and null if login failed", async () => {
      const email = "email@gmail.com";
      const password = "fakepassword";

      const { rowCount, rows } = await db.query(
        `SELECT u.user_id 
        FROM users u 
        INNER JOIN local_users lu ON u.user_id=lu.user_id
        WHERE LOWER(u.email)='${email.toLowerCase()}' AND lu.password='${password}' AND lu.is_active=true`
      );
      expect(rowCount).toBe(0);
      expect(rows[0]).toBeUndefined();
    });
  });

  describe("Get user profile", () => {
    test("should return profile information", async () => {
      const userId = 1;

      const { rowCount, rows } = await db.query(
        `SELECT user_id, type_name, email, title, first_name, last_name, profession, u.institution_id AS institution_id, institution_name, nhi, hpi, u.dhb_id AS dhb_id, dhb_name, u.hospital_id AS hospital_id, hospital_name
        FROM users u 
        INNER JOIN user_types ut ON u.type_id=ut.type_id
        LEFT JOIN institutions i ON u.institution_id=i.institution_id
        LEFT JOIN dhbs d ON u.dhb_id=d.dhb_id
        LEFT JOIN hospitals h ON u.hospital_id=h.hospital_id
        WHERE user_id=${userId}`
      );
      expect(rowCount).toBe(1);
      expect(rows[0].email).toBe(userInfo.email);
      expect(rows[0].first_name).toBe(userInfo.firstName);
      expect(rows[0].last_name).toBe(userInfo.lastName);
    });
  });

  describe("Change password", () => {
    const userId = 1;
    const newPassword = "newpassword";
    const oldPassword = userInfo.password;

    test("should return rowCount == 1 and matched new password if change successfully with old password", async () => {
      let query = `UPDATE local_users 
                SET password='${newPassword}', updated=Now() 
                WHERE user_id=${userId}`;

      const { rowCount } = await db.query(
        oldPassword === null
          ? query
          : (query += ` and password='${oldPassword}'`)
      );
      expect(rowCount).toBe(1);

      const { rows } = await db.query(
        `SELECT password
        FROM local_users
        WHERE user_id=${userId}`
      );
      expect(rows[0].password).toBe(newPassword);
    });

    test("should return rowCount == 1 and matched new password if change successfully without old password", async () => {
      const newNewPassword = "newnewpassword";
      const oldPassword = null;
      let query = `UPDATE local_users 
                SET password='${newNewPassword}', updated=Now() 
                WHERE user_id=${userId}`;

      const { rowCount } = await db.query(
        oldPassword === null
          ? query
          : (query += ` and password='${oldPassword}'`)
      );
      expect(rowCount).toBe(1);

      const { rows } = await db.query(
        `SELECT password
        FROM local_users
        WHERE user_id=${userId}`
      );
      expect(rows[0].password).toBe(newNewPassword);
    });
  });

  describe("Delete account", () => {
    test("should return rowCount == 1 if delete successfully", async () => {
      const userId = 1;

      const { rowCount } = await db.query(
        `DELETE FROM users 
        WHERE user_id=${userId}`
      );
      expect(rowCount).toBe(1);
    });
  });
});
