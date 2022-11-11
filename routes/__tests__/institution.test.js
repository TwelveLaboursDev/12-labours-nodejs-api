const request = require("supertest");
const express = require("express");
const institutionRouter = require("../institution");
const generateMockData = require("./mockFunction");

const getInstitutions = jest.fn();

const institutionRoutes = institutionRouter({
  getInstitutions,
});

describe("GET /institutions", () => {
  const app = express();
  app.use(institutionRoutes);

  beforeEach(() => {
    getInstitutions.mockReset();
  });

  describe("get institutions", () => {
    test("should respond with a 200 status code", async () => {
      getInstitutions.mockResolvedValue(generateMockData(3));

      const response = await request(app).get("/institutions");
      expect(response.statusCode).toBe(200);
    });

    test("should respond with a json object containing institutions", async () => {
      getInstitutions.mockResolvedValue(generateMockData(3));

      const response = await request(app).get("/institutions");
      expect(getInstitutions.mock.calls.length).toBe(1);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveLength(3);
    });
  });

  describe("when institutions are missing", () => {
    test("should respond with a 404 status code", async () => {
      getInstitutions.mockResolvedValue(generateMockData(0));

      const response = await request(app).get("/institutions");
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe("Institutions data not found");
    });
  });
});
