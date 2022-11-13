const router = require("express").Router();
const User = require("../../controllers/User");

const localUserRouter = require("./local");
const localUserRoutes = localUserRouter(new User());
router.use(localUserRoutes);

const googleUserRouter = require("./google");
const googleUserRoutes = googleUserRouter(new User());
router.use(googleUserRoutes);

module.exports = router;
