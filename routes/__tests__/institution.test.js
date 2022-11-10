const request = require("supertest");
const express = require("express");
const route = require("../institution");
const app = express();
app.use("/", route);

describe("GET /institutions", () => {
  test("should get institutions", async () => {
    const response = await request(app).get("/institutions");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[1]["display"]).toBe("University of Auckland");
  });
});
