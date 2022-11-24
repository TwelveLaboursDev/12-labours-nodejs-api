const express = require("express");

function typeRouter(typeObject) {
  const router = express.Router();

  router.get("/types", async (req, res) => {
    try {
      const types = await typeObject.getTypes();

      if (types.length == 0) {
        res.status(404).json({ message: "Types data not found" });
      } else {
        res.status(200).send(types);
      }
    } catch (err) {
      console.log(err);
    }
  });
  return router;
}

module.exports = typeRouter;
