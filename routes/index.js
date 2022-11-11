var router = require("express").Router();

const allUserRoutes = require("./user");
router.use(allUserRoutes);

const dhbsRouter = require("./dhb");
const Dhb = require("../controllers/Dhb");
const dhbRoutes = dhbsRouter(new Dhb());
router.use(dhbRoutes);

const hospitalRoutes = require("./hospital");
router.use(hospitalRoutes);

const institutionRoutes = require("./institution");
router.use(institutionRoutes);

module.exports = router;
