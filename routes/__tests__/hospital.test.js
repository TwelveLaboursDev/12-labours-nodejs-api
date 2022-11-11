const request = require("supertest");
const express = require("express");
const hospitalRouter = require("../hospital");
const generateMockData = require("./mockFunction");

const getHospitals = jest.fn();

const hospitalRoutes = hospitalRouter({
  getHospitals,
});

describe("GET /hospitals", () => {
  const app = express();
  app.use(hospitalRoutes);

  beforeEach(() => {
    getHospitals.mockReset();
  });

  describe("get hospitals", () => {
    test("should respond with a 200 status code", async () => {
      getHospitals.mockResolvedValue(generateMockData(3));

      const response = await request(app).get("/hospitals");
      expect(response.statusCode).toBe(200);
    });

    test("should respond with a json object containing hospitals", async () => {
      getHospitals.mockResolvedValue(generateMockData(3));

      const response = await request(app).get("/hospitals");
      expect(getHospitals.mock.calls.length).toBe(1);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveLength(3);
    });
  });

  describe("when hospitals are missing", () => {
    test("should respond with a 404 status code", async () => {
      getHospitals.mockResolvedValue(generateMockData(0));

      const response = await request(app).get("/hospitals");
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("Hospitals data not found");
    });
  });
});
