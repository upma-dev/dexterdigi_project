const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { Authentication, Authorization } = require("../../../middleware");
const { newsController } = require("../../../controllers");

const router = express.Router();

const uploadDir = path.join(__dirname, "../../../uploads/news");
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
const uploadFields = upload.fields([
  { name: "cover_image", maxCount: 1 },
  { name: "thumbnail_url", maxCount: 1 },
  { name: "gallery_images", maxCount: 10 },
]);

router.post(
  "/create-news",
  Authentication,
  Authorization,
  uploadFields,
  newsController.createNews
);

router.get("/news-list", Authentication, Authorization, newsController.getAllNews);

router.get(
  "/get-news/:id",
  Authentication,
  Authorization,
  newsController.getById
);

router.put(
  "/update-news/:id",
  Authentication,
  Authorization,
  uploadFields,
  newsController.updateNews
);

router.delete(
  "/delete-news/:id",
  Authentication,
  Authorization,
  newsController.deleteNews
);

router.patch(
  "/update-news-status/:id",
  Authentication,
  Authorization,
  newsController.changeStatus
);

module.exports = router;

