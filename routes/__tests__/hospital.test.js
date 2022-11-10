const request = require("supertest");
const express = require("express");
const route = require("../hospital");
const app = express();
app.use("/", route);

describe("GET /hospitals", () => {
  test("should get hospitals", async () => {
    const response = await request(app).get("/hospitals");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(40);
    expect(response.body[0]["display"]).toBe("Bay of Islands Hospital");
  });
});
