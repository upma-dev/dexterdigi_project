const express = require("express");
const router = express.Router();
const { employeeController } = require("../../../controllers");
const { Authentication, Authorization } = require("../../../middleware");
const multer = require("multer");

// 🧷 Multer config for employee image upload
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "images");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const trimmedName = file.originalname.trim().replace(/\s+/g, '_');
      cb(null, uniqueSuffix + '_' + trimmedName);
    },
  }),
}).fields([{ name: 'image', maxCount: 1 }]);

// 🧑 Admin / Employee CRUD Routes,
router.post("/create-employee", Authentication, Authorization, upload, employeeController.createEmployee); // ✅ Corrected name
router.get("/employee-lists", employeeController.getAdmins);
router.get("/get-employee/:id", Authentication, Authorization, employeeController.getUserById);
router.put("/edit-employee/:id", Authentication,Authorization, upload, employeeController.updateUser);
router.delete("/delete-employee/:id", Authentication, Authorization, employeeController.deleteUser);

module.exports = router;
