const db = require("../__mocks__/db.mock");

describe("Get institution information query", () => {
  test("should return institution data", async () => {
    const { rows } = await db.query(
      `SELECT institution_id AS value, institution_name AS display 
      FROM institutions 
      ORDER BY institution_name`
    );
    expect(rows).toBeDefined();
    expect(rows).toHaveLength(2);
    expect(rows).toContainEqual({
      value: expect.any(Number),
      display: "University of Auckland",
    });
  });
});
