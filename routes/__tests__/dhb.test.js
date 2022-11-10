const request = require("supertest");
const express = require("express");
const route = require("../dhb");
const app = express();
app.use("/", route);

describe("GET /dhbs", () => {
  test("should get district health boards", async () => {
    const response = await request(app).get("/dhbs");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]["label"]).toBe("North Island");
    expect(response.body[1]["label"]).toBe("South Island");
    // expect(response.body).toBe("South");
  });
});
