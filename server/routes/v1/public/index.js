const express = require("express");
const authRoute = require("./auth.route");
const sideBarMenu = require("./sidebarMenu.route")
const imageRoute = require('./images.route')
const permission = require('./permission.route')


const router = express.Router();



router.use("/auth", authRoute);
router.use("/menus", sideBarMenu);
router.use("/permission",permission)
router.use("/images", imageRoute);


module.exports = router;