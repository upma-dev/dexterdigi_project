const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { newsService } = require("../services");

const STATUS_ENUM = ["draft", "review", "scheduled", "published", "archived"];

const parseBoolean = (value, defaultValue = false) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return ["true", "1", "yes", "on"].includes(value.toLowerCase());
  }

  if (typeof value === "number") {
    return value === 1;
  }

  return defaultValue;
};

const parseArrayField = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean).map((item) => item.trim());
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean).map((item) => String(item).trim());
      }
    } catch (error) {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
};

const parseDateField = (value) => {
  if (!value) {
    return undefined;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const buildScheduleTime = (publishDate, scheduleTime) => {
  if (!scheduleTime) {
    return undefined;
  }

  const baseDate = parseDateField(publishDate) || new Date();
  const [hours = "0", minutes = "0"] = scheduleTime.split(":");
  const scheduleDate = new Date(baseDate);
  scheduleDate.setHours(parseInt(hours, 10) || 0, parseInt(minutes, 10) || 0, 0, 0);
  return scheduleDate;
};

const cleanPayload = (payload) => {
  const cleaned = {};
  Object.entries(payload).forEach(([key, value]) => {
    if (typeof value === "undefined") {
      return;
    }
    cleaned[key] = value;
  });
  return cleaned;
};

const buildNewsPayload = (req) => {
  const { body, files = {} } = req;

  const statusValue = typeof body.status === "string" ? body.status.toLowerCase() : body.status;
  const payload = {
    title: body.title,
    subtitle: body.subtitle,
    breaking_line: body.breaking_line ?? body.breakingLine,
    summary: body.summary,
    content: body.content,
    slug: body.slug?.trim(),
    category: body.category,
    sub_category: body.sub_category ?? body.subCategory,
    tags: undefined,
    location: body.location,
    video_url: body.video_url ?? body.videoUrl,
    embed_code: body.embed_code ?? body.embedCode,
    status: STATUS_ENUM.includes(statusValue) ? statusValue : "draft",
    is_breaking: parseBoolean(body.is_breaking ?? body.isBreaking, false),
    is_featured: parseBoolean(body.is_featured ?? body.isFeatured, false),
    publish_date: parseDateField(body.publish_date ?? body.publishDate),
    expiry_date: parseDateField(body.expiry_date ?? body.expiryDate),
    schedule_time: buildScheduleTime(body.publish_date ?? body.publishDate, body.schedule_time ?? body.scheduleTime),
    author: body.author,
    reading_time: body.reading_time ?? body.readingTime,
    report_source: body.report_source ?? body.reportSource,
    source_url: body.source_url ?? body.sourceUrl,
    comments_enabled: parseBoolean(body.comments_enabled ?? body.commentsEnabled, true),
    reactions_enabled: parseBoolean(body.reactions_enabled ?? body.reactionsEnabled, true),
    seo_title: body.seo_title ?? body.seoTitle,
    seo_description: body.seo_description ?? body.seoDescription,
    seo_keywords: undefined,
    canonical_url: body.canonical_url ?? body.canonicalUrl,
    og_image: body.og_image,
  };

  const tags = parseArrayField(body.tags ?? body.tag);
  if (tags.length) {
    payload.tags = tags;
  }

  const seoKeywords = parseArrayField(body.seo_keywords ?? body.seoKeywords);
  if (seoKeywords.length) {
    payload.seo_keywords = seoKeywords;
  }

  let galleryImages = parseArrayField(
    body.existing_gallery_images ?? body.gallery_images ?? body.gallery
  );

  const coverImageFile = files.cover_image?.[0];
  if (coverImageFile) {
    payload.cover_image = coverImageFile.filename;
  } else if (body.cover_image || body.image) {
    payload.cover_image = body.cover_image || body.image;
  }

  const thumbnailFile = files.thumbnail_url?.[0];
  if (thumbnailFile) {
    payload.thumbnail_url = thumbnailFile.filename;
  } else if (body.thumbnail_url || body.thumbnail) {
    payload.thumbnail_url = body.thumbnail_url || body.thumbnail;
  }

  const galleryFiles = files.gallery_images || [];
  if (galleryFiles.length) {
    galleryImages = [
      ...galleryImages,
      ...galleryFiles.map((file) => file.filename),
    ];
  }

  if (galleryImages.length) {
    payload.gallery_images = galleryImages;
  }

  return cleanPayload(payload);
};

const createNews = catchAsync(async (req, res) => {
  const payload = buildNewsPayload(req);
  payload.created_by = req.user?.sub;
  payload.updated_by = req.user?.sub;

  const news = await newsService.createNews(payload);
  res
    .status(httpStatus.CREATED)
    .json({ success: true, message: "News created successfully", data: news });
});

const getAllNews = catchAsync(async (req, res) => {
  const { page, limit, search } = req.query;
  const result = await newsService.getAllNews({ page, limit, search });
  res.status(httpStatus.OK).json({ success: true, data: result });
});

const getById = catchAsync(async (req, res) => {
  const news = await newsService.getNewsById(req.params.id);
  if (!news) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ success: false, message: "News not found" });
  }
  res.status(httpStatus.OK).json({ success: true, data: news });
});

const updateNews = catchAsync(async (req, res) => {
  const payload = buildNewsPayload(req);
  payload.updated_by = req.user?.sub;

  const updatedNews = await newsService.updateNews(req.params.id, payload);
  if (!updatedNews) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ success: false, message: "News not found" });
  }
  res
    .status(httpStatus.OK)
    .json({
      success: true,
      message: "News updated successfully",
      data: updatedNews,
    });
});

const deleteNews = catchAsync(async (req, res) => {
  const deletedNews = await newsService.deleteNews(req.params.id);
  if (!deletedNews) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ success: false, message: "News not found" });
  }
  res
    .status(httpStatus.OK)
    .json({ success: true, message: "News deleted successfully" });
});

const changeStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  if (!status || !STATUS_ENUM.includes(status)) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: `Status is required and must be one of: ${STATUS_ENUM.join(", ")}`,
    });
  }

  const updatedNews = await newsService.changeStatus(req.params.id, status);
  if (!updatedNews) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ success: false, message: "News not found" });
  }

  res
    .status(httpStatus.OK)
    .json({ success: true, message: "News status updated", data: updatedNews });
});

module.exports = {
  createNews,
  getAllNews,
  getById,
  updateNews,
  deleteNews,
  changeStatus,
};

