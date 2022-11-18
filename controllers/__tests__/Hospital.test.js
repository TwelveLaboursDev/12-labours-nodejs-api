const db = require("../__mocks__/db.mock");

describe("Get hospital information query", () => {
  test("should return hospital data", async () => {
    const { rows } = await db.query(
      `SELECT hospital_id AS value, hospital_name AS display
      FROM hospitals
      ORDER BY hospital_name`
    );
    expect(rows).toBeDefined();
    expect(rows).toHaveLength(40);
    expect(rows).toContainEqual({
      value: expect.any(Number),
      display: "Murchison Hospital and Health Centre",
    });
  });
});
