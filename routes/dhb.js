const express = require("express");

function dhbsRouter(dhbDatabase) {
  const router = express.Router();

  router.get("/dhbs", async (req, res) => {
    try {
      const dhbsNorth = await dhbDatabase.getNorthDhbs();
      const dhbsSouth = await dhbDatabase.getSouthDhbs();

      if (dhbsNorth.length <= 0 || dhbsSouth.length <= 0) {
        res.status(404).send({ error: "Dhbs data not found" });
        return;
      } else {
        const dhbs = [
          { label: "North Island", options: dhbsNorth },
          { label: "South Island", options: dhbsSouth },
        ];
        res.status(200).send(dhbs);
      }
    } catch (err) {
      console.log(err);
      res.status(500);
      return;
    }
  });
  return router;
}

module.exports = dhbsRouter;
