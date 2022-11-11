const request = require("supertest");
const express = require("express");
const { userRouter } = require("../user");

const userRoutes = userRouter({});

const app = express();
app.use(userRoutes);

describe("GET /user/profile", () => {});

describe("POST /user/delete", () => {});
