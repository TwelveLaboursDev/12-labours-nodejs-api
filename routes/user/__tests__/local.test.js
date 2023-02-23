const request = require("supertest");
const express = require("express");
const localUserRouter = require("../local");
const { signUserToken } = require("../../../middleware/auth");
const ASEEncryptPassword = require("../__mocks__/AESEncrypt.mock");
const fakeASEEncryptPassword = require("../__mocks__/AESEncryptWithFakeKey.mock");
const hashEncryptPassword = require("../__mocks__/hashEncrypt.mock");

const queryDbPassword = jest.fn();
const authenticateLocal = jest.fn();
const createUser = jest.fn();
const localUserExists = jest.fn();
const emailExists = jest.fn();
const activateLocal = jest.fn();
const getProfileById = jest.fn();
const changePassword = jest.fn();
const deleteUser = jest.fn();
const updateUserInfo = jest.fn();

const localUserRoutes = localUserRouter({
  queryDbPassword,
  authenticateLocal,
  createUser,
  localUserExists,
  emailExists,
  activateLocal,
  getProfileById,
  changePassword,
  deleteUser,
  updateUserInfo,
});

const API_KEY = process.env.API_KEY;
const userToken = signUserToken(8, "mockemail@gmail.com");

describe("Local user APIs", () => {
  const app = express();
  app.use(express.json());
  app.use(localUserRoutes);

  beforeEach(() => {
    queryDbPassword.mockReset();
    authenticateLocal.mockReset();
    createUser.mockReset();
    localUserExists.mockReset();
    emailExists.mockReset();
    activateLocal.mockReset();
    getProfileById.mockReset();
    changePassword.mockReset();
    deleteUser.mockReset();
    updateUserInfo.mockReset();
  });

  describe("POST /user/local/register", () => {
    const strategy = "local";
    const userInfo = {
      title: "mockTitle",
      firstName: "mockfirstname",
      lastName: "mocklastname",
      email: "mockemail@gmail.com",
      password: ASEEncryptPassword("mockpassword"),
    };

    describe("Register new user successfully", () => {
      test("should respond with a 200 status code and correct email address", async () => {
        emailExists.mockResolvedValue(false);
        createUser.mockResolvedValue(8);

        const response = await request(app)
          .post("/user/local/register")
          .send({ userInfo, strategy })
          .set("Authorization", `${API_KEY}`);
        expect(response.statusCode).toBe(200);
        expect(emailExists.mock.calls.length).toBe(1);
        expect(createUser.mock.calls.length).toBe(1);
        expect(response.body.email).toBe(userInfo.email);
      });
    });

    describe("Failed to register new user", () => {
      test("should respond with a 400 status code when missing user information", async () => {
        const response = await request(app)
          .post("/user/local/register")
          .send({ strategy })
          .set("Authorization", `${API_KEY}`);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("User Information is missing");
      });

      test("should respond with a 401 status code when SECRET_KEY not match", async () => {
        const userInfo = {
          title: "mockTitle",
          firstName: "mockfirstname`",
          lastName: "mocklastname'",
          email: "mockemail@gmail.com",
          password: fakeASEEncryptPassword('mockpassword"'),
        };

        const response = await request(app)
          .post("/user/local/register")
          .send({ userInfo, strategy })
          .set("Authorization", `${API_KEY}`);
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe(
          "Server unauthorized, please contact 12 Labours Dev Team."
        );
      });

      test("should respond with a 400 status code when contains invalid input", async () => {
        const userInfo = {
          title: "mockTitle",
          firstName: "mockfirstname`",
          lastName: "mocklastname'",
          email: "mockemail@gmail.com",
          password: ASEEncryptPassword('mockpassword"'),
        };

        const response = await request(app)
          .post("/user/local/register")
          .send({ userInfo, strategy })
          .set("Authorization", `${API_KEY}`);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Invalid symbols are included");
      });

      test("should respond with a 409 status code when the email exists", async () => {
        emailExists.mockResolvedValue(true);

        const response = await request(app)
          .post("/user/local/register")
          .send({ userInfo, strategy })
          .set("Authorization", `${API_KEY}`);
        expect(response.statusCode).toBe(409);
        expect(emailExists.mock.calls.length).toBe(1);
        expect(response.body.message).toBe("Email already exists");
      });

      test("should respond with a 404 status code when database occurs error", async () => {
        emailExists.mockResolvedValue(false);
        createUser.mockResolvedValue(null);

        const response = await request(app)
          .post("/user/local/register")
          .send({ userInfo, strategy })
          .set("Authorization", `${API_KEY}`);
        expect(response.statusCode).toBe(404);
        expect(emailExists.mock.calls.length).toBe(1);
        expect(createUser.mock.calls.length).toBe(1);
        expect(response.body.message).toBe(
          "An error occurred while creating user. Try again."
        );
      });
    });
  });

  describe("POST /user/local/email", () => {
    const email = "mockemail@gmail.com";

    describe("Send the email successfully", () => {
      test("should respond with a 200 status code and active status", async () => {
        localUserExists.mockResolvedValue({ user_id: 8, is_active: true });

        const response = await request(app)
          .post("/user/local/email")
          .send({ email })
          .set("Authorization", `${API_KEY}`);
        expect(response.statusCode).toBe(200);
        expect(localUserExists.mock.calls.length).toBe(1);
        expect(response.body.alreadyActive).toBe(true);
      });

      test("should respond with a 200 status code and correct email address", async () => {
        localUserExists.mockResolvedValue({ user_id: 8, is_active: false });

        const response = await request(app)
          .post("/user/local/email")
          .send({ email })
          .set("Authorization", `${API_KEY}`);
        expect(response.statusCode).toBe(200);
        expect(localUserExists.mock.calls.length).toBe(1);
        expect(response.body.email).toBe(email);
      });
    });

    describe("Failed to send the email", () => {
      test("should respond with a 400 status code when missing email", async () => {
        const response = await request(app)
          .post("/user/local/email")
          .send()
          .set("Authorization", `${API_KEY}`);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Email not provided");
      });

      test("should respond with a 400 status code when user is invalid", async () => {
        localUserExists.mockResolvedValue(null);

        const response = await request(app)
          .post("/user/local/email")
          .send({ email })
          .set("Authorization", `${API_KEY}`);
        expect(response.statusCode).toBe(400);
        expect(localUserExists.mock.calls.length).toBe(1);
        expect(response.body.message).toBe(
          "Invalid user, please register a new account."
        );
      });
    });
  });

  describe("POST /user/local/confirm", () => {
    const emailFromToken = "mockemail@gmail.com";
    const idFromToken = 8;
    const tokenStatus = "valid";

    describe("Activate the account successfully", () => {
      test("should respond with a 200 status code when account is already activated", async () => {
        localUserExists.mockResolvedValue({ user_id: 8, is_active: true });

        const response = await request(app)
          .post("/user/local/confirm")
          .send({ emailFromToken, idFromToken, tokenStatus })
          .set("Authorization", `${API_KEY}`)
          .set("access_token", `Bearer ${userToken}`);
        expect(response.statusCode).toBe(200);
        expect(localUserExists.mock.calls.length).toBe(1);
        expect(response.body.alreadyActive).toBe(true);
      });

      test("should respond with a 200 status code when account is activated", async () => {
        localUserExists.mockResolvedValue({ user_id: 8, is_active: false });
        activateLocal.mockResolvedValue(true);

        const response = await request(app)
          .post("/user/local/confirm")
          .send({ emailFromToken, idFromToken, tokenStatus })
          .set("Authorization", `${API_KEY}`)
          .set("access_token", `Bearer ${userToken}`);
        expect(response.statusCode).toBe(200);
        expect(localUserExists.mock.calls.length).toBe(1);
        expect(activateLocal.mock.calls.length).toBe(1);
      });
    });

    describe("Failed to activate the account", () => {
      test("should respond with a 400 status code when missing user id or does not match", async () => {
        const idFromToken = 6;

        const response = await request(app)
          .post("/user/local/confirm")
          .send({ emailFromToken, idFromToken, tokenStatus })
          .set("Authorization", `${API_KEY}`)
          .set("access_token", `Bearer ${userToken}`);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe(
          "Invalid user, please register a new account."
        );
      });

      // test("should respond with a 401 status code when token expired", async () => {
      //   const tokenStatus = "expired";
      //   localUserExists.mockResolvedValue({ user_id: 8, is_active: false });
      //   activateLocal.mockResolvedValue(false);

      //   const response = await request(app)
      //     .post("/user/local/confirm")
      //     .send({ emailFromToken, idFromToken, tokenStatus })
      //     .set("Authorization", `${API_KEY}`)
      //     .set("access_token", `Bearer ${userToken}`);
      //   expect(response.statusCode).toBe(500);
      //   expect(localUserExists.mock.calls.length).toBe(1);
      //   expect(activateLocal.mock.calls.length).toBe(1);
      //   expect(response.body.message).toBe(
      //     "Your verification has expired. A new email with confirmation link has been sent to your inbox."
      //   );
      // });

      test("should respond with a 500 status code when database error", async () => {
        const tokenStatus = "valid";
        localUserExists.mockResolvedValue({ user_id: 8, is_active: false });
        activateLocal.mockResolvedValue(false);

        const response = await request(app)
          .post("/user/local/confirm")
          .send({ emailFromToken, idFromToken, tokenStatus })
          .set("Authorization", `${API_KEY}`)
          .set("access_token", `Bearer ${userToken}`);
        expect(response.statusCode).toBe(500);
        expect(localUserExists.mock.calls.length).toBe(1);
        expect(activateLocal.mock.calls.length).toBe(1);
        expect(response.body.message).toBe(
          "Database error occurred. Try again later."
        );
      });
    });
  });

  describe("POST /user/local/login", () => {
    const email = "mockemail@gmail.com";
    const password = ASEEncryptPassword("mockpassword");

    describe("Login successfully", () => {
      test("should respond with a 200 status code and correct user information", async () => {
        authenticateLocal.mockResolvedValue({ user_id: 8 });
        queryDbPassword.mockResolvedValue(hashEncryptPassword("mockpassword"));
        getProfileById.mockResolvedValue({
          user_id: 8,
          title: "mockTitle",
          firstName: "mockfirstname",
          lastName: "mocklastname",
          email: "mockemail@gmail.com",
          password: hashEncryptPassword("mockpassword"),
        });

        const response = await request(app)
          .post("/user/local/login")
          .send({ email, password })
          .set("Authorization", `${API_KEY}`);
        expect(response.statusCode).toBe(200);
        expect(authenticateLocal.mock.calls.length).toBe(1);
        expect(queryDbPassword.mock.calls.length).toBe(1);
        expect(getProfileById.mock.calls.length).toBe(1);
        expect(response.body.user.user_id).toBe(8);
        expect(response.body.user.email).toBe(email);
        expect(response.body.user.password.slice(0, 7)).toBe("$2b$12$");
      });
    });

    describe("Failed to login", () => {
      test("should respond with a 400 status code when missing email or password", async () => {
        const response = await request(app)
          .post("/user/local/login")
          .send()
          .set("Authorization", `${API_KEY}`);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Provide email and password");
      });

      test("should respond with a 400 status code when contains invalid input", async () => {
        const email = "mockemail@gmail.com";
        const password = ASEEncryptPassword("mockpassword`'");

        const response = await request(app)
          .post("/user/local/login")
          .send({ email, password })
          .set("Authorization", `${API_KEY}`);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Invalid symbols are included");
      });

      test("should respond with a 404 status code when email not found", async () => {
        authenticateLocal.mockResolvedValue(null);

        const response = await request(app)
          .post("/user/local/login")
          .send({ email, password })
          .set("Authorization", `${API_KEY}`);
        expect(response.statusCode).toBe(404);
        expect(authenticateLocal.mock.calls.length).toBe(1);
        expect(response.body.message).toBe(
          "User with specified email was not found"
        );
      });

      test("should respond with a 404 status code when password not match", async () => {
        const email = "mockemail@gmail.com";
        const password = ASEEncryptPassword("fakepassword");
        authenticateLocal.mockResolvedValue({ user_id: 8 });
        queryDbPassword.mockResolvedValue(hashEncryptPassword("mockpassword"));

        const response = await request(app)
          .post("/user/local/login")
          .send({ email, password })
          .set("Authorization", `${API_KEY}`);
        expect(response.statusCode).toBe(404);
        expect(queryDbPassword.mock.calls.length).toBe(1);
        expect(response.body.message).toBe(
          "The password does not match the account"
        );
      });
    });
  });

  describe("Get /user/local/profile", () => {
    describe("Get the profile successfully", () => {
      test("should respond with a 200 status code", async () => {
        getProfileById.mockResolvedValue({
          user_id: 8,
          title: "mockTitle",
          firstName: "mockfirstname",
          lastName: "mocklastname",
          email: "mockemail@gmail.com",
          password: "mockpassword",
        });

        const response = await request(app)
          .get("/user/local/profile")
          .set("access_token", `Bearer ${userToken}`);
        expect(response.statusCode).toBe(200);
        expect(getProfileById.mock.calls.length).toBe(1);
      });
    });

    describe("Failed to get the profile", () => {
      // test("should respond with a 401 status code when token expired", async () => {});

      test("should respond with a 404 status code when user not found", async () => {
        getProfileById.mockResolvedValue(null);

        const response = await request(app)
          .get("/user/local/profile")
          .set("access_token", `Bearer ${userToken}`);
        expect(response.statusCode).toBe(404);
        expect(getProfileById.mock.calls.length).toBe(1);
        expect(response.body.message).toBe("User not found");
      });
    });
  });

  describe("POST /user/local/profile/update", () => {
    const userInfo = {
      userId: 8,
      email: "mockemail@gmail.com",
      title: "Mr",
      firstName: "firstname",
      lastName: "lastname",
      profession: "ICT",
      institutionId: 2,
      hospitalId: 3,
      dhbId: 1,
    };

    describe("Update user profile successfully", () => {
      test("should respond with a 200 status code", async () => {
        emailExists.mockResolvedValue(true);
        getProfileById.mockResolvedValue(userInfo);
        updateUserInfo.mockResolvedValue(true);

        const response = await request(app)
          .post("/user/local/profile/update")
          .send({ userInfo })
          .set("access_token", `Bearer ${userToken}`);
        expect(response.statusCode).toBe(200);
        expect(getProfileById.mock.calls.length).toBe(2);
        expect(emailExists.mock.calls.length).toBe(1);
        expect(updateUserInfo.mock.calls.length).toBe(1);
        expect(response.body.user).toEqual(userInfo);
      });
    });

    describe("Failed to update user profile", () => {
      // test("should respond with a 401 status code when token expired", async () => {});

      test("should respond with a 400 status code when user info is missing", async () => {
        const response = await request(app)
          .post("/user/local/profile/update")
          .send()
          .set("access_token", `Bearer ${userToken}`);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("User information is missing");
      });

      test("should respond with a 404 status code when email not found", async () => {
        emailExists.mockResolvedValue(false);

        const response = await request(app)
          .post("/user/local/profile/update")
          .send({ userInfo })
          .set("access_token", `Bearer ${userToken}`);
        expect(response.statusCode).toBe(404);
        expect(emailExists.mock.calls.length).toBe(1);
        expect(response.body.message).toBe("Email does not exist");
      });

      test("should respond with a 400 status code when invalid user id used", async () => {
        emailExists.mockResolvedValue(true);
        getProfileById.mockResolvedValue(null);

        const response = await request(app)
          .post("/user/local/profile/update")
          .send({ userInfo })
          .set("access_token", `Bearer ${userToken}`);
        expect(response.statusCode).toBe(400);
        expect(emailExists.mock.calls.length).toBe(1);
        expect(getProfileById.mock.calls.length).toBe(1);
        expect(response.body.message).toBe("Invalid user id provided");
      });

      test("should respond with a 500 status code when update failed", async () => {
        emailExists.mockResolvedValue(true);
        getProfileById.mockResolvedValue(userInfo);
        updateUserInfo.mockResolvedValue(false);

        const response = await request(app)
          .post("/user/local/profile/update")
          .send({ userInfo })
          .set("access_token", `Bearer ${userToken}`);
        expect(response.statusCode).toBe(500);
        expect(emailExists.mock.calls.length).toBe(1);
        expect(getProfileById.mock.calls.length).toBe(1);
        expect(updateUserInfo.mock.calls.length).toBe(1);
        expect(response.body.message).toBe(
          "Your request cannot be completed. Try again."
        );
      });
    });
  });

  describe("POST /user/local/password", () => {
    const userId = 8;
    const newPassword = ASEEncryptPassword("newmockpassword");
    const oldPassword = ASEEncryptPassword("mockpassword");

    describe("Change the password successfully", () => {
      test("should respond with a 200 status code", async () => {
        queryDbPassword.mockResolvedValue(hashEncryptPassword("mockpassword"));
        changePassword.mockResolvedValue(true);

        const response = await request(app)
          .post("/user/local/password")
          .send({ userId, newPassword, oldPassword })
          .set("access_token", `Bearer ${userToken}`);
        expect(response.statusCode).toBe(200);
        expect(changePassword.mock.calls.length).toBe(1);
      });
    });

    describe("Failed to change the password", () => {
      test("should respond with a 400 status code when missing data", async () => {
        const response = await request(app)
          .post("/user/local/password")
          .send()
          .set("access_token", `Bearer ${userToken}`);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Incomplete data was provided");
      });

      test("should respond with a 400 status code when contains invalid input", async () => {
        const newPassword = ASEEncryptPassword("newmockpassword`");
        const oldPassword = ASEEncryptPassword("mockpassword'");

        const response = await request(app)
          .post("/user/local/password")
          .send({ userId, newPassword, oldPassword })
          .set("access_token", `Bearer ${userToken}`);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Invalid symbols are included");
      });

      // test("should respond with a 401 status code when token expired or user not match", async () => {});

      test("should respond with a 500 status code when database error", async () => {
        queryDbPassword.mockResolvedValue(hashEncryptPassword("mockpassword"));
        changePassword.mockResolvedValue(false);

        const response = await request(app)
          .post("/user/local/password")
          .send({ userId, newPassword, oldPassword })
          .set("access_token", `Bearer ${userToken}`);
        expect(response.statusCode).toBe(500);
        expect(queryDbPassword.mock.calls.length).toBe(1);
        expect(changePassword.mock.calls.length).toBe(1);
        expect(response.body.message).toBe(
          "Your request cannot be processed. Try again."
        );
      });

      test("should respond with a 404 status code when password not match", async () => {
        const oldPassword = ASEEncryptPassword("fakepassword");

        queryDbPassword.mockResolvedValue(hashEncryptPassword("mockpassword"));

        const response = await request(app)
          .post("/user/local/password")
          .send({ userId, newPassword, oldPassword })
          .set("access_token", `Bearer ${userToken}`);
        expect(response.statusCode).toBe(404);
        expect(queryDbPassword.mock.calls.length).toBe(1);
        expect(response.body.message).toBe(
          "The old password does not match the account"
        );
      });
    });
  });

  describe("POST /user/local/password/reset", () => {
    const email = "mockemail@gmail.com";

    // describe("Send reset password email successfully", () => {
    //   test("should respond with a 200 status code", async () => {});
    // });

    describe("Failed to send reset password email", () => {
      test("should respond with a 400 status code when missing email", async () => {
        const response = await request(app)
          .post("/user/local/password/reset")
          .send()
          .set("Authorization", `${API_KEY}`);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Required email is missing");
      });

      test("should respond with a 404 status code when email does not exist", async () => {
        localUserExists.mockResolvedValue(false);

        const response = await request(app)
          .post("/user/local/password/reset")
          .send({ email })
          .set("Authorization", `${API_KEY}`);
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("The email has not been registered");
      });

      test("should respond with a 401 status code when account not activated", async () => {
        localUserExists.mockResolvedValue({ user_id: 8, is_active: false });
        const sendStatus = true;

        const response = await request(app)
          .post("/user/local/password/reset")
          .send({ email })
          .set("Authorization", `${API_KEY}`);
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe(
          `The email has not been activated. ${
            sendStatus
              ? `Confirm email has been sent to ${email}`
              : "Sending email failed. Try again later."
          }`
        );
      });
    });
  });

  describe("POST /user/local/delete", () => {
    const userId = 8;

    describe("Delete the account successfully", () => {
      test("should respond with a 200 status code", async () => {
        deleteUser.mockResolvedValue(true);

        const response = await request(app)
          .post("/user/local/delete")
          .send({ userId })
          .set("access_token", `Bearer ${userToken}`);
        expect(response.statusCode).toBe(200);
        expect(deleteUser.mock.calls.length).toBe(1);
      });
    });

    describe("Failed to delete the account", () => {
      test("should respond with a 400 status code when missing user id", async () => {
        const response = await request(app)
          .post("/user/local/delete")
          .send()
          .set("access_token", `Bearer ${userToken}`);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Incomplete data was provided");
      });

      // test("should respond with a 401 status code when token expired or id not match", async () => {});

      test("should respond with a 500 status code when database error", async () => {
        deleteUser.mockResolvedValue(false);

        const response = await request(app)
          .post("/user/local/delete")
          .send({ userId })
          .set("access_token", `Bearer ${userToken}`);
        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe(
          "Your request cannot be completed. Try again."
        );
      });
    });
  });
});
