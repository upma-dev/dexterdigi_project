const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { Authentication, Authorization } = require("../../../middleware");
const { authorController } = require("../../../controllers");

const router = express.Router();

const uploadDir = path.join(__dirname, "../../../uploads/authors");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const sanitized = file.originalname.trim().replace(/\s+/g, "_");
    cb(null, `${uniqueSuffix}_${sanitized}`);
  },
});

const upload = multer({ storage });

router.post(
  "/create-author",
  Authentication,
  Authorization,
  upload.single("profile_image"),
  authorController.createAuthor
);

router.get(
  "/author-list",
  Authentication,
  Authorization,
  authorController.listAuthors
);

module.exports = router;

