const express = require("express");
const router = express.Router();
const { Authentication } = require("../../../middleware");
const sidebarMenuController = require("../../../controllers/sidebarMenu.controller");

router.get("/sidebar-menus", Authentication, sidebarMenuController.getSidebarMenus);
router.post("/update-sidebarmenu-production-count", Authentication, sidebarMenuController.updateSidebarMenuStatusCount)
router.get("/sidebar-menus-list", Authentication, sidebarMenuController.getAllSidebarMenus);

module.exports = router; 