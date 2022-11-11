const request = require("supertest");
const express = require("express");
const dhbRouter = require("../dhb");
const generateMockData = require("./mockFunction");

const getNorthDhbs = jest.fn();
const getSouthDhbs = jest.fn();

const dhbRoutes = dhbRouter({
  getNorthDhbs,
  getSouthDhbs,
});

describe("GET /dhbs", () => {
  const app = express();
  app.use(dhbRoutes);

  beforeEach(() => {
    getNorthDhbs.mockReset();
    getSouthDhbs.mockReset();
  });

  describe("get district health boards", () => {
    test("should respond with a 200 status code", async () => {
      getNorthDhbs.mockResolvedValue(generateMockData(3));
      getSouthDhbs.mockResolvedValue(generateMockData(2));

      const response = await request(app).get("/dhbs");
      expect(response.statusCode).toBe(200);
    });

    test("should respond with a json object containing district health boards", async () => {
      getNorthDhbs.mockResolvedValue(generateMockData(3));
      getSouthDhbs.mockResolvedValue(generateMockData(2));

      const response = await request(app).get("/dhbs");
      expect(getNorthDhbs.mock.calls.length).toBe(1);
      expect(getSouthDhbs.mock.calls.length).toBe(1);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveLength(2);
      expect(response.body[0]["label"]).toBe("North Island");
      expect(response.body[1]["label"]).toBe("South Island");
    });
  });

  describe("when north and south district health boards are missing", () => {
    test("should respond with a 404 status code", async () => {
      getNorthDhbs.mockResolvedValue(generateMockData(0));
      getSouthDhbs.mockResolvedValue(generateMockData(2));

      const response = await request(app).get("/dhbs");
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("Dhbs data not found");
    });
  });
});
