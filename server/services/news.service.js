const { News, Author } = require("../models");

const statusEnum = ["draft", "review", "scheduled", "published", "archived"];

const createNews = async (data) => {
  const news = new News(data);
  await news.save();
  return news.populate("author");
};

const buildSearchQuery = async (search) => {
  if (!search) {
    return {};
  }

  const regex = { $regex: search, $options: "i" };
  const conditions = [
    { title: regex },
    { category: regex },
    { slug: regex },
    { tags: regex },
  ];

  const authorIds = await Author.find({ name: regex }).distinct("_id");
  if (authorIds.length) {
    conditions.push({ author: { $in: authorIds } });
  }

  return { $or: conditions };
};

const getAllNews = async ({ page = 1, limit = 10, search = "" }) => {
  const pageNumber = Math.max(1, parseInt(page, 10) || 1);
  const limitNumber = Math.max(1, parseInt(limit, 10) || 10);
  const skip = (pageNumber - 1) * limitNumber;

  const query = await buildSearchQuery(search);

  const [items, total] = await Promise.all([
    News.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limitNumber)
      .populate("author"),
    News.countDocuments(query),
  ]);

  return {
    items,
    total,
    page: pageNumber,
    limit: limitNumber,
    totalPages: Math.ceil(total / limitNumber) || 1,
  };
};

const getNewsById = async (id) => {
  return News.findById(id).populate("author");
};

const updateNews = async (id, data) => {
  return News.findByIdAndUpdate(id, data, { new: true }).populate("author");
};

const deleteNews = async (id) => {
  return News.findByIdAndDelete(id);
};

const changeStatus = async (id, status) => {
  const normalizedStatus = statusEnum.includes(status) ? status : "draft";
  return News.findByIdAndUpdate(
    id,
    { status: normalizedStatus },
    { new: true }
  ).populate("author");
};

module.exports = {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
  changeStatus,
};

