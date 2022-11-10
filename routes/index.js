var router = require("express").Router();

const allUserRoutes = require("./user");
router.use(allUserRoutes);

const dhbsRouter = require("./dhb");
const dhbDatabase = require("../controllers/Dhb");
const dhbRoutes = dhbsRouter(dhbDatabase);
router.use(dhbRoutes);

const hospitalRoutes = require("./hospital");
router.use(hospitalRoutes);

const institutionRoutes = require("./institution");
router.use(institutionRoutes);

module.exports = router;
