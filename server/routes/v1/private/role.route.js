const express = require("express");
const router = express.Router();
const { roleController } = require("../../../controllers");
const { Authentication, Authorization } = require("../../../middleware");


router.post("/create-role",  Authentication, Authorization, roleController.createRole);
router.get("/roles-lists", roleController.getRoles);
router.get("/get-role/:id", Authentication, Authorization, roleController.getRoleById);
router.put("/edit-role/:id", Authentication, Authorization, roleController.updateRoleById);
router.delete("/delete-role/:id", Authentication, Authorization, roleController.deleteRole);


module.exports = router;
