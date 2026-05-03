const mongoose = require("mongoose");

const statusEnum = ["draft", "review", "scheduled", "published", "archived"];

const newsSchema = new mongoose.Schema(
  {
    // Basic Information
    title: { type: String, required: true, trim: true, maxlength: 200 },
    subtitle: { type: String, trim: true, maxlength: 300 },
    breaking_line: { type: String, trim: true, maxlength: 200 },
    summary: { type: String, trim: true, maxlength: 500 },
    content: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    // Categorization
    category: { type: String, required: true, trim: true },
    sub_category: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    location: { type: String, trim: true },

    // Media Section
    cover_image: { type: String, trim: true },
    thumbnail_url: { type: String, trim: true },
    gallery_images: [{ type: String }],
    video_url: { type: String, trim: true },
    embed_code: { type: String, trim: true },

    // Publication Details
    status: { type: String, enum: statusEnum, default: "draft" },
    is_breaking: { type: Boolean, default: false },
    is_featured: { type: Boolean, default: false },
    publish_date: { type: Date },
    expiry_date: { type: Date },
    schedule_time: { type: Date },

    // Author Reference
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },

    // Engagement / Analytics
    views_count: { type: Number, default: 0 },
    likes_count: { type: Number, default: 0 },
    shares_count: { type: Number, default: 0 },
    comments_count: { type: Number, default: 0 },
    trending_score: { type: Number, default: 0 },

    // Reader Interaction
    comments_enabled: { type: Boolean, default: true },
    reactions_enabled: { type: Boolean, default: true },

    // Reading Metrics
    reading_time: { type: String, trim: true },

    // SEO Optimization
    seo_title: { type: String, trim: true, maxlength: 70 },
    seo_description: { type: String, trim: true, maxlength: 160 },
    seo_keywords: [{ type: String, trim: true }],
    canonical_url: { type: String, trim: true },
    og_image: { type: String, trim: true },

    // External / Source Info
    report_source: { type: String, trim: true },
    source_url: { type: String, trim: true },

    // Created / Updated Info
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admins",
      required: true,
    },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "Admins" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const News = mongoose.model("News", newsSchema);

module.exports.News = News;
