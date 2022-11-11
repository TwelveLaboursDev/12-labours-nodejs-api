var router = require("express").Router();

const allUserRoutes = require("./user");
router.use(allUserRoutes);

const dhbRouter = require("./dhb");
const Dhb = require("../controllers/Dhb");
const dhbRoutes = dhbRouter(new Dhb());
router.use(dhbRoutes);

const hospitalRouter = require("./hospital");
const Hospital = require("../controllers/Hospital");
const hospitalRoutes = hospitalRouter(new Hospital());
router.use(hospitalRoutes);

const institutionRoutes = require("./institution");
router.use(institutionRoutes);

module.exports = router;
