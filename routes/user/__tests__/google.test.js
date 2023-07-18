const request = require("supertest");
const express = require("express");
const googleUserRouter = require("../google");
const { signUserToken } = require("../../../middleware/auth");

const authenticateGoogle = jest.fn();
const getProfileById = jest.fn();

const googleUserRoutes = googleUserRouter({
  authenticateGoogle,
  getProfileById,
});

// jest.mock("../../../middleware/auth", () => ({
//   getGoogleToken: (_, __, next) => next(),
// }));

jest.mock("../supportFunction", () => ({
  addNewUser: (_, __, next) => next(),
}));

const API_KEY = process.env.LOGIN_API_KEY;
const mockToken = signUserToken(8, "mockemail@gmail.com", "2h");

describe("Google user APIs", () => {
  const app = express();
  app.use(express.json());
  app.use(googleUserRoutes);

  beforeEach(() => {
    authenticateGoogle.mockReset();
    getProfileById.mockReset();
  });

  //   describe("POST /user/google/login", () => {
  //     describe("Login successfully", () => {
  //       test("should respond with a 200 status code", async () => {
  //         const response = await request(app).post("/user/google/login").send();
  //         expect(response.statusCode).toBe(200);
  //       });
  //     });
  //     describe("Failed to login", () => {});
  //   });

  describe("POST /user/google/register", () => {
    const mockUser = {
      user_id: 8,
      title: "mockTitle",
      firstName: "mockfirstname`",
      lastName: "mocklastname'",
      email: "mockemail@gmail.com",
      password: 'mockpassword"',
    };

    describe("Register new user successfully", () => {
      test("should respond with a 200 status code", async () => {
        getProfileById.mockResolvedValue({
          user_id: 8,
          title: "mockTitle",
          firstName: "mockfirstname`",
          lastName: "mocklastname'",
          email: "mockemail@gmail.com",
          password: 'mockpassword"',
        });

        const response = await request(app)
          .post("/user/google/register")
          .send()
          .set("Authorization", `${API_KEY}`);
        expect(response.statusCode).toBe(200);
        expect(getProfileById.mock.calls.length).toBe(1);
        expect(response.body.user.user_id).toBe(mockUser.user_id);
        expect(response.body.access_token).toBe(mockToken);
      });
    });

    describe("Failed to register new user", () => {
      test("should respond with a 404 status code when database error", async () => {
        getProfileById.mockResolvedValue(null);

        const response = await request(app)
          .post("/user/google/register")
          .send()
          .set("Authorization", `${API_KEY}`);
        expect(response.statusCode).toBe(404);
        expect(getProfileById.mock.calls.length).toBe(1);
        expect(response.body.message).toBe(
          "An error occurred while creating user. Try again."
        );
      });
    });
  });
});
