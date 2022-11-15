// const request = require("supertest");
// const express = require("express");
// const googleUserRouter = require("../google");

// const authenticateGoogle = jest.fn();
// const getProfileById = jest.fn();

// const googleUserRoutes = googleUserRouter({
//   authenticateGoogle,
//   getProfileById,
// });

// const API_KEY = process.env.API_KEY;

// describe("Google user APIs", () => {
//   const app = express();
//   app.use(express.json());
//   app.use(googleUserRoutes);

//   describe("POST /user/google/login", () => {
//     test("", async () => {});
//   });

//   describe("POST /user/google/register", () => {
//     describe("Register new user successfully", () => {
//       test("should respond with a 200 status code", async () => {});
//     });

//     describe("Failed to register new user", () => {
//       test("should respond with a 404 status code when database error", async () => {});
//     });
//   });
// });
