const { Author } = require("../models");

const createAuthor = async (data) => {
  const author = new Author(data);
  return author.save();
};

const listAuthors = async ({ search = "" } = {}) => {
  const query = {};
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }
  return Author.find(query).sort({ createdAt: -1 });
};

const getAuthorById = async (id) => Author.findById(id);

module.exports = {
  createAuthor,
  listAuthors,
  getAuthorById,
};

