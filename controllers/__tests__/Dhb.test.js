const db = require("../__mocks__/db.mock");

describe("get district health boards information queries", () => {
  test("should return the north island dhbs data", async () => {
    const { rows } = await db.query(
      `SELECT dhb_id AS value, dhb_name AS display 
        FROM dhbs 
        WHERE island='North'`
    );
    expect(rows).toBeDefined();
    expect(rows).toHaveLength(16);
    expect(rows).toContainEqual({
      value: expect.any(Number),
      display: "Auckland",
    });
  });

  test("should return the south island dhbs data", async () => {
    const { rows } = await db.query(
      `SELECT dhb_id AS value, dhb_name AS display 
        FROM dhbs 
        WHERE island='South'`
    );
    expect(rows).toBeDefined();
    expect(rows).toHaveLength(5);
    expect(rows).toContainEqual({
      value: expect.any(Number),
      display: "West Coast",
    });
  });
});
