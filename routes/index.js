const router = require("express").Router();

const allUserRoutes = require("./user");
router.use(allUserRoutes);

const identityRouter = require("./identity");
const Identity = require("../controllers/Identity");
const identityRoutes = identityRouter(new Identity());
router.use(identityRoutes);

const institutionRouter = require("./institution");
const Institution = require("../controllers/Institution");
const institutionRoutes = institutionRouter(new Institution());
router.use(institutionRoutes);

const hospitalRouter = require("./hospital");
const Hospital = require("../controllers/Hospital");
const hospitalRoutes = hospitalRouter(new Hospital());
router.use(hospitalRoutes);

const dhbRouter = require("./dhb");
const Dhb = require("../controllers/Dhb");
const dhbRoutes = dhbRouter(new Dhb());
router.use(dhbRoutes);

module.exports = router;
