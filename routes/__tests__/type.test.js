const request = require("supertest");
const express = require("express");
const typeRouter = require("../type");
const generateMockData = require("./mockFunction");

const getTypes = jest.fn();

const typeRoutes = typeRouter({
  getTypes,
});

describe("GET /types", () => {
  const app = express();
  app.use(typeRoutes);

  beforeEach(() => {
    getTypes.mockReset();
  });

  describe("get types", () => {
    test("should respond with a 200 status code", async () => {
      getTypes.mockResolvedValue(generateMockData(3));

      const response = await request(app).get("/types");
      expect(response.statusCode).toBe(200);
    });

    test("should respond with a json object containing types", async () => {
      getTypes.mockResolvedValue(generateMockData(3));

      const response = await request(app).get("/types");
      expect(getTypes.mock.calls.length).toBe(1);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveLength(3);
    });
  });

  describe("when types are missing", () => {
    test("should respond with a 404 status code", async () => {
      getTypes.mockResolvedValue(generateMockData(0));

      const response = await request(app).get("/types");
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("Types data not found");
    });
  });
});
