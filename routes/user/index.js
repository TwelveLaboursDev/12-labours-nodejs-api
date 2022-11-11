const router = require("express").Router();

const localUserRoutes = require("./local");
const googleUserRoutes = require("./google");

const { userRouter } = require("./user");
const User = require("../../controllers/User");
const userRoutes = userRouter(new User());
router.use(userRoutes);

router.use(localUserRoutes);
router.use(googleUserRoutes);

module.exports = router;
