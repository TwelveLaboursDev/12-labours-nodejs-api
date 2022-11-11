const express = require("express");

function dhbRouter(dhbObject) {
  const router = express.Router();

  router.get("/dhbs", async (req, res) => {
    try {
      const dhbsNorth = await dhbObject.getNorthDhbs();
      const dhbsSouth = await dhbObject.getSouthDhbs();

      if (dhbsNorth.length == 0 || dhbsSouth.length == 0) {
        res.status(404).send({ error: "Dhbs data not found" });
      } else {
        const dhbs = [
          { label: "North Island", options: dhbsNorth },
          { label: "South Island", options: dhbsSouth },
        ];
        res.status(200).send(dhbs);
      }
    } catch (err) {
      console.log(err);
    }
  });
  return router;
}

module.exports = dhbRouter;
