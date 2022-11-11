const express = require("express");

function hospitalRouter(hospitalObject) {
  const router = express.Router();

  router.get("/hospitals", async (req, res) => {
    try {
      const hospitals = await hospitalObject.getHospitals();

      if (hospitals.length == 0) {
        res.status(404).send({ error: "Hospitals data not found" });
        return;
      } else {
        res.status(200).send(hospitals);
      }
    } catch (err) {
      console.log(err);
      res.status(500);
      return;
    }
  });
  return router;
}

module.exports = hospitalRouter;
