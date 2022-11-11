const request = require("supertest");
const express = require("express");
const identityRouter = require("../identity");
const generateMockData = require("./mockFunction");

const getIdentities = jest.fn();

const identityRoutes = identityRouter({
  getIdentities,
});

describe("GET /identities", () => {
  const app = express();
  app.use(identityRoutes);

  beforeEach(() => {
    getIdentities.mockReset();
  });

  describe("get identities", () => {
    test("should respond with a 200 status code", async () => {
      getIdentities.mockResolvedValue(generateMockData(3));

      const response = await request(app).get("/identities");
      expect(response.statusCode).toBe(200);
    });

    test("should respond with a json object containing identities", async () => {
      getIdentities.mockResolvedValue(generateMockData(3));

      const response = await request(app).get("/identities");
      expect(getIdentities.mock.calls.length).toBe(1);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveLength(3);
    });
  });

  describe("when identities are missing", () => {
    test("should respond with a 404 status code", async () => {
      getIdentities.mockResolvedValue(generateMockData(0));

      const response = await request(app).get("/identities");
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("Identities data not found");
    });
  });
});
