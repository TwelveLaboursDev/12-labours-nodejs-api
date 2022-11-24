const express = require("express");

function institutionRouter(institutionObject) {
  const router = express.Router();

  router.get("/institutions", async (req, res) => {
    try {
      const institutions = await institutionObject.getInstitutions();

      if (institutions.length == 0) {
        res.status(404).json({ message: "Institutions data not found" });
      } else {
        res.status(200).send(institutions);
      }
    } catch (err) {
      console.log(err);
    }
  });
  return router;
}

module.exports = institutionRouter;
