var router = require("express").Router();

const allUserRoutes = require("./user");
const dhbRoutes = require("./dhb");
const hospitalRoutes = require("./hospital");
const institutionRoutes = require("./institution");

router.use(allUserRoutes);
router.use(dhbRoutes);
router.use(hospitalRoutes);
router.use(institutionRoutes);

module.exports = router;
