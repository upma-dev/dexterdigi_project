const express = require("express");
const roles = require("./role.route");
const employee = require("./employee.route");
const news = require("./news.route");
const author = require("./author.route");

const router = express.Router();

router.use("/role", roles);
router.use("/employee", employee);
router.use("/news", news);
router.use("/author", author);



module.exports = router;