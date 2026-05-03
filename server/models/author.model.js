const mongoose = require("mongoose");

const socialLinksSchema = new mongoose.Schema(
  {
    facebook: { type: String, trim: true },
    twitter: { type: String, trim: true },
    instagram: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    youtube: { type: String, trim: true },
  },
  { _id: false }
);

const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    bio: { type: String, trim: true },
    profile_image: { type: String, trim: true },
    social_links: {
      type: socialLinksSchema,
      default: {},
    },
  },
  { timestamps: true }
);

const Author = mongoose.model("Author", authorSchema);

module.exports.Author = Author;

