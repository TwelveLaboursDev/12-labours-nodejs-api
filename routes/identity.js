const express = require("express");

function identityRouter(identityObject) {
  const router = express.Router();

  router.get("/identities", async (req, res) => {
    try {
      const identities = await identityObject.getIdentities();

      if (identities.length == 0) {
        res.status(404).json({ message: "Identities data not found" });
      } else {
        res.status(200).send(identities);
      }
    } catch (err) {
      console.log(err);
    }
  });
  return router;
}

module.exports = identityRouter;
