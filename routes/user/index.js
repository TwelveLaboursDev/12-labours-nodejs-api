const router = require("express").Router();

const googleUserRoutes = require("./google");

const localUserRouter = require("./local");
const User = require("../../controllers/User");
const localUserRoutes = localUserRouter(new User());
router.use(localUserRoutes);

router.use(googleUserRoutes);

module.exports = router;
