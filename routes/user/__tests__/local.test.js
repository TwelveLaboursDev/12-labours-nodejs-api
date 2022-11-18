const request = require("supertest");
const express = require("express");
const localUserRouter = require("../local");
const { signUserToken } = require("../../../middleware/auth");

const authenticateLocal = jest.fn();
const createUser = jest.fn();
const localUserExists = jest.fn();
const activateLocal = jest.fn();
const getProfileById = jest.fn();
const changePassword = jest.fn();
const deleteUser = jest.fn();

const localUserRoutes = localUserRouter({
  authenticateLocal,
  createUser,
  localUserExists,
  activateLocal,
  getProfileById,
  changePassword,
  deleteUser,
});

const API_KEY = process.env.API_KEY;
const userToken = signUserToken(8, "mockemail@gmail.com");

describe("Local user APIs", () => {
  const app = express();
  app.use(express.json());
  app.use(localUserRoutes);

  beforeEach(() => {
    authenticateLocal.mockReset();
    createUser.mockReset();
    localUserExists.mockReset();
    activateLocal.mockReset();
    getProfileById.mockReset();
    changePassword.mockReset();
    deleteUser.mockReset();
  });

  describe("POST /user/local/register", () => {
    const strategy = "local";
    const userInfo = {
      title: "mockTitle",
      firstName: "mockfirstname",
      lastName: "mocklastname",
      email: "mockemail@gmail.com",
      password: "mockpassword",
    };

    describe("Register new user successfully", () => {
      test("should respond with a 200 status code and correct email address", async () => {
        localUserExists.mockResolvedValue(null);
        createUser.mockResolvedValue(8);

        const response = await request(app)
          .post("/user/local/register")
          .send({ userInfo, strategy })
          .set("Authorization", `${API_KEY}`);
        expect(response.statusCode).toBe(200);
        expect(localUserExists.mock.calls.length).toBe(1);
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

      test("should respond with a 400 status code when contains invalid input", async () => {
        const userInfo = {
          title: "mockTitle",
          firstName: "mockfirstname`",
          lastName: "mocklastname'",
          email: "mockemail@gmail.com",
          password: 'mockpassword"',
        };

        const response = await request(app)
          .post("/user/local/register")
          .send({ userInfo, strategy })
          .set("Authorization", `${API_KEY}`);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Invalid symbols are included");
      });

      test("should respond with a 409 status code when the email exists", async () => {
        localUserExists.mockResolvedValue([{ user_id: 8, is_active: true }]);

        const response = await request(app)
          .post("/user/local/register")
          .send({ userInfo, strategy })
          .set("Authorization", `${API_KEY}`);
        expect(response.statusCode).toBe(409);
        expect(localUserExists.mock.calls.length).toBe(1);
        expect(response.body.message).toBe("Email already exists");
      });

      test("should respond with a 404 status code when database occurs error", async () => {
        localUserExists.mockResolvedValue(null);
        createUser.mockResolvedValue(null);

        const response = await request(app)
          .post("/user/local/register")
          .send({ userInfo, strategy })
          .set("Authorization", `${API_KEY}`);
        expect(response.statusCode).toBe(404);
        expect(localUserExists.mock.calls.length).toBe(1);
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
      test("should respond with a 404 status code when missing email", async () => {
        const response = await request(app)
          .post("/user/local/email")
          .send()
          .set("Authorization", `${API_KEY}`);
        expect(response.statusCode).toBe(404);
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
      test("should respond with a 200 status code and active status", async () => {
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

      test("should respond with a 400 status code when token expired", async () => {
        const tokenStatus = "valid";
        // This should be changed based on the real situation
        // const sendStatus = false;

        localUserExists.mockResolvedValue({ user_id: 8, is_active: false });

        const response = await request(app)
          .post("/user/local/confirm")
          .send({ emailFromToken, idFromToken, tokenStatus })
          .set("Authorization", `${API_KEY}`)
          .set("access_token", `Bearer ${userToken}`);
        expect(response.statusCode).toBe(400);
        expect(localUserExists.mock.calls.length).toBe(1);
        // expect(response.body.message).toBe(
        //   sendStatus
        //     ? "Your verification has expired. A new email with confirmation link has been sent to your inbox."
        //     : "Unexpected error occurred. Try again later."
        // );
      });

      test("should respond with a 400 status code when database error", async () => {
        localUserExists.mockResolvedValue({ user_id: 8, is_active: false });
        activateLocal.mockResolvedValue(false);

        const response = await request(app)
          .post("/user/local/confirm")
          .send({ emailFromToken, idFromToken, tokenStatus })
          .set("Authorization", `${API_KEY}`)
          .set("access_token", `Bearer ${userToken}`);
        expect(response.statusCode).toBe(400);
        expect(localUserExists.mock.calls.length).toBe(1);
        expect(activateLocal.mock.calls.length).toBe(1);
        expect(response.body.message).toBe(
          "Unexpected error occurred. Try again later."
        );
      });
    });
  });

  describe("POST /user/local/login", () => {
    const email = "mockemail@gmail.com";
    const password = "mockpassword";

    describe("Login successfully", () => {
      test("should respond with a 200 status code and correct user information", async () => {
        authenticateLocal.mockResolvedValue({ user_id: 8 });
        getProfileById.mockResolvedValue({
          user_id: 8,
          title: "mockTitle",
          firstName: "mockfirstname",
          lastName: "mocklastname",
          email: "mockemail@gmail.com",
          password: "mockpassword",
        });

        const response = await request(app)
          .post("/user/local/login")
          .send({ email, password })
          .set("Authorization", `${API_KEY}`);
        expect(response.statusCode).toBe(200);
        expect(authenticateLocal.mock.calls.length).toBe(1);
        expect(getProfileById.mock.calls.length).toBe(1);
        expect(response.body.user.user_id).toBe(8);
        expect(response.body.user.email).toBe(email);
        expect(response.body.user.password).toBe(password);
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
        const password = "mockpassword`'";

        const response = await request(app)
          .post("/user/local/login")
          .send({ email, password })
          .set("Authorization", `${API_KEY}`);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Invalid symbols are included");
      });

      test("should respond with a 400 status code when email or password not found", async () => {
        authenticateLocal.mockResolvedValue(null);

        const response = await request(app)
          .post("/user/local/login")
          .send({ email, password })
          .set("Authorization", `${API_KEY}`);
        expect(response.statusCode).toBe(403);
        expect(authenticateLocal.mock.calls.length).toBe(1);
        expect(response.body.message).toBe(
          "User with specified email/password was not found"
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
      test("should respond with a 403 status code when user not found", async () => {
        getProfileById.mockResolvedValue(null);

        const response = await request(app)
          .get("/user/local/profile")
          .set("access_token", `Bearer ${userToken}`);
        expect(response.statusCode).toBe(403);
        expect(getProfileById.mock.calls.length).toBe(1);
        expect(response.body.message).toBe("User not found");
      });

      // test("should respond with a 401 status code when token expired", async () => {});
    });
  });

  describe("POST /user/local/password", () => {
    const userId = 8;
    const newPassword = "newmockpassword";
    const oldPassword = "mockpassword";

    describe("Change the password successfully", () => {
      test("should respond with a 200 status code", async () => {
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
      test("should respond with a 404 status code when missing data", async () => {
        const response = await request(app)
          .post("/user/local/password")
          .send()
          .set("access_token", `Bearer ${userToken}`);
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Incomplete data was provided");
      });

      // test("should respond with a 401 status code when token expired or user not match", async () => {});

      test("should respond with a 400 status code when contains invalid input", async () => {
        const newPassword = "newmockpassword`";
        const oldPassword = "mockpassword'";

        const response = await request(app)
          .post("/user/local/password")
          .send({ userId, newPassword, oldPassword })
          .set("access_token", `Bearer ${userToken}`);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Invalid symbols are included");
      });

      test("should respond with a 403 status code when database error", async () => {
        changePassword.mockResolvedValue(false);

        const response = await request(app)
          .post("/user/local/password")
          .send({ userId, newPassword, oldPassword })
          .set("access_token", `Bearer ${userToken}`);
        expect(response.statusCode).toBe(403);
        expect(changePassword.mock.calls.length).toBe(1);
        expect(response.body.message).toBe(
          "Your request can not be authenticated. Try again."
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
      test("should respond with a 404 status code when missing user id", async () => {
        const response = await request(app)
          .post("/user/local/delete")
          .send()
          .set("access_token", `Bearer ${userToken}`);
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Incomplete data was provided");
      });

      test("should respond with a 403 status code when database error", async () => {
        deleteUser.mockResolvedValue(false);

        const response = await request(app)
          .post("/user/local/delete")
          .send({ userId })
          .set("access_token", `Bearer ${userToken}`);
        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe(
          "Your request can not be completed. Try again."
        );
      });
    });
  });
});
