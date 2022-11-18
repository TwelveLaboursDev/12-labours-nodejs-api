const db = require("../__mocks__/db.mock");

describe("Get user type information query", () => {
  test("should return user type data", async () => {
    const { rows } = await db.query(
      `SELECT type_id AS value, type_name AS display 
      FROM user_types`
    );
    expect(rows).toBeDefined();
    expect(rows).toHaveLength(3);
    expect(rows).toContainEqual({ value: 1, display: "Researcher" });
  });
});
