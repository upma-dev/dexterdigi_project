const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { authorService } = require("../services");

const parseSocialLinks = (value) => {
  if (!value) {
    return {};
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return typeof parsed === "object" && parsed !== null ? parsed : {};
    } catch (error) {
      return {};
    }
  }

  if (typeof value === "object") {
    return value;
  }

  return {};
};

const buildAuthorPayload = (body, file) => {
  const payload = {
    name: body.name,
    bio: body.bio,
    social_links: parseSocialLinks(body.social_links),
  };

  if (file) {
    payload.profile_image = file.filename;
  }

  return payload;
};

const createAuthor = catchAsync(async (req, res) => {
  const payload = buildAuthorPayload(req.body, req.file);
  const author = await authorService.createAuthor(payload);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Author created successfully",
    data: author,
  });
});

const listAuthors = catchAsync(async (req, res) => {
  const { search } = req.query;
  const authors = await authorService.listAuthors({ search });

  res.status(httpStatus.OK).json({
    success: true,
    data: authors,
  });
});

module.exports = {
  createAuthor,
  listAuthors,
};

