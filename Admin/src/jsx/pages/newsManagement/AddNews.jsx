import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ToastContainer } from "react-toastify";
import { Modal } from "react-bootstrap";

import PageTitle from "../../layouts/PageTitle";
import Loader from "../../components/Loader/Loader";
import { Toaster } from "../../components/Toaster/Toster";

import { createNewsApi } from "../../../services/newsApi";
import { createAuthorApi, getAuthorsApi } from "../../../services/authorApi";

// Dropdown options
const newsCategories = [
  "Politics",
  "Business",
  "Technology",
  "Sports",
  "Entertainment",
  "Health",
  "Science",
  "World",
  "National",
  "Local",
  "Lifestyle",
  "Education",
  "Environment",
  "Crime",
  "Weather",
  "Opinion",
  "Editorial",
  "Other",
];

const newsSubCategories = {
  Politics: [
    "National Politics",
    "International Politics",
    "Elections",
    "Government",
    "Policy",
  ],
  Business: [
    "Markets",
    "Economy",
    "Finance",
    "Corporate",
    "Startups",
    "Real Estate",
  ],
  Technology: [
    "AI & Machine Learning",
    "Mobile",
    "Web Development",
    "Cybersecurity",
    "Gadgets",
    "Software",
  ],
  Sports: [
    "Cricket",
    "Football",
    "Basketball",
    "Tennis",
    "Olympics",
    "Formula 1",
  ],
  Entertainment: [
    "Movies",
    "Music",
    "Celebrities",
    "TV Shows",
    "Bollywood",
    "Hollywood",
  ],
  Health: [
    "Fitness",
    "Nutrition",
    "Mental Health",
    "Medical Research",
    "Diseases",
    "Wellness",
  ],
  Science: [
    "Space",
    "Environment",
    "Research",
    "Innovation",
    "Physics",
    "Biology",
  ],
  World: [
    "Asia",
    "Europe",
    "America",
    "Africa",
    "Middle East",
    "International News",
  ],
  National: [
    "India",
    "Current Affairs",
    "Government Policies",
    "Parliament",
    "Supreme Court",
  ],
  Local: ["City News", "State News", "Community", "Events", "Local Government"],
  Lifestyle: [
    "Fashion",
    "Food",
    "Travel",
    "Home & Garden",
    "Relationships",
    "Parenting",
  ],
  Education: [
    "Schools",
    "Colleges",
    "Exams",
    "Admissions",
    "Education Policy",
    "Research",
  ],
  Environment: [
    "Climate Change",
    "Pollution",
    "Conservation",
    "Wildlife",
    "Sustainable Living",
  ],
  Crime: [
    "Law & Order",
    "Police",
    "Court Cases",
    "Cyber Crime",
    "Investigation",
  ],
  Weather: ["Forecast", "Climate", "Natural Disasters", "Seasonal Changes"],
  Opinion: ["Editorials", "Columns", "Analysis", "Commentary", "Debates"],
  Editorial: [
    "News Analysis",
    "Feature Stories",
    "Investigative",
    "Special Reports",
  ],
  Other: ["Other"],
};

const newsTags = [
  "Breaking News",
  "Exclusive",
  "Trending",
  "Viral",
  "Must Read",
  "Featured",
  "Hot Topic",
  "Analysis",
  "Interview",
  "Press Release",
  "Live Updates",
  "Photo Story",
  "Video",
  "Infographic",
  "Poll",
  "Survey",
  "Opinion Piece",
  "Review",
  "Guide",
  "Tutorial",
  "News Roundup",
  "Daily Brief",
  "Weekend Read",
  "Deep Dive",
  "Investigation",
  "Fact Check",
  "Myth Buster",
  "Expert Opinion",
  "Case Study",
  "Research",
  "Statistics",
  "Data Story",
  "Timeline",
  "Q&A",
  "Profile",
  "Biography",
  "Obituary",
  "Announcement",
  "Update",
  "Correction",
  "Follow-up",
  "Related Story",
  "Background",
  "Context",
  "Explanation",
  "How-to",
  "Tips",
  "Advice",
  "Warning",
  "Alert",
  "Emergency",
  "Urgent",
  "Important",
  "Notice",
  "Public Service",
  "Community",
  "Local Impact",
  "Regional",
  "National",
  "International",
  "Global",
  "Worldwide",
  "Other",
];

const initialFormState = {
  title: "",
  breakingLine: "",
  summary: "",
  content: "",
  category: "",
  subCategory: "",
  tag: "",
  slug: "",
  author: "",
  location: "",
  readingTime: "",
  reportSource: "",
  sourceUrl: "",
  publishDate: "",
  expiryDate: "",
  scheduleTime: "",
  videoUrl: "",
  embedCode: "",
  status: "draft",
};

const initialAuthorState = {
  name: "",
  bio: "",
  socialLinks: {
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    youtube: "",
  },
};

// Slug generator
const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const AddNews = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  // MEDIA STATES
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  // AUTHOR STATES
  const [authors, setAuthors] = useState([]);
  const [authorsLoading, setAuthorsLoading] = useState(false);
  const [showAuthorCard, setShowAuthorCard] = useState(false);
  const [authorForm, setAuthorForm] = useState(initialAuthorState);
  const [authorErrors, setAuthorErrors] = useState({});
  const [authorProfileFile, setAuthorProfileFile] = useState(null);
  const [authorProfilePreview, setAuthorProfilePreview] = useState(null);
  const [authorSubmitting, setAuthorSubmitting] = useState(false);

  // CUSTOM INPUT STATES
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [showCustomSubCategory, setShowCustomSubCategory] = useState(false);
  const [showCustomTag, setShowCustomTag] = useState(false);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ------------------------ FETCH AUTHORS ------------------------
  useEffect(() => {
    const loadAuthors = async () => {
      setAuthorsLoading(true);
      try {
        const res = await getAuthorsApi();
        setAuthors(res?.data?.data || []);
      } catch (err) {
        Toaster.error("Failed to load authors");
      } finally {
        setAuthorsLoading(false);
      }
    };
    loadAuthors();
  }, []);

  // ------------------------ VALIDATION ------------------------
  const validate = () => {
    const err = {};

    if (!formData.title.trim()) err.title = "Title is required";
    if (!formData.breakingLine.trim())
      err.breakingLine = "Breaking line is required";
    if (!formData.summary.trim()) err.summary = "Summary is required";
    if (!formData.content.trim()) err.content = "Content is required";
    if (!formData.category.trim()) err.category = "Category is required";
    if (!formData.subCategory.trim())
      err.subCategory = "Sub category is required";
    if (!formData.tag.trim()) err.tag = "Tag is required";
    if (!formData.slug.trim()) err.slug = "Slug is required";
    if (!formData.author.trim()) err.author = "Author is required";
    if (!formData.publishDate) err.publishDate = "Publish date required";
    if (!formData.expiryDate) err.expiryDate = "Expiry date required";
    if (!coverImageFile) err.coverImage = "Cover image is required";

    return err;
  };

  // ------------------------ AUTHOR VALIDATION ------------------------
  const validateAuthorForm = () => {
    const err = {};
    if (!authorForm.name.trim()) err.name = "Author name is required";

    Object.entries(authorForm.socialLinks).forEach(([key, value]) => {
      if (value && !value.startsWith("http")) {
        err[key] = `${key} must be a valid URL`;
      }
    });

    return err;
  };

  // ------------------------ INPUT HANDLER ------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    setFormData((prev) => {
      if (name === "title") {
        const next = { ...prev, title: value };
        if (!prev.slug) next.slug = slugify(value);
        return next;
      }
      if (name === "slug") return { ...prev, slug: slugify(value) };

      // Handle custom category
      if (name === "category") {
        setShowCustomCategory(value === "Other");
        if (value !== "Other") {
          setShowCustomSubCategory(false); // Reset subcategory custom input
        }
      }

      // Handle custom subcategory
      if (name === "subCategory") {
        setShowCustomSubCategory(value === "Other");
      }

      // Handle custom tag
      if (name === "tag") {
        setShowCustomTag(value === "Other");
      }

      return { ...prev, [name]: value };
    });
  };

  // ------------------------ MEDIA HANDLING ------------------------
  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverImageFile(file);
    setCoverImagePreview(URL.createObjectURL(file));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const clearCoverImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview(null);
  };

  const clearThumbnailImage = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const previews = files.map((file) => URL.createObjectURL(file));

    setGalleryFiles((prev) => [...prev, ...files]);
    setGalleryPreviews((prev) => [...prev, ...previews]);
  };

  const removeGalleryImage = (index) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ------------------------ HIGHLIGHT EMPTY FIELDS ------------------------
  const highlightEmptyFields = (errors) => {
    // Focus on first error field
    const errorFields = Object.keys(errors);
    if (errorFields.length > 0) {
      const firstErrorField = errorFields[0];
      let selector;
      if (firstErrorField === "coverImage") {
        selector = ".cover-upload";
      } else if (firstErrorField === "content") {
        selector = ".ck-editor";
      } else {
        selector = `[name="${firstErrorField}"]`;
      }
      const element = document.querySelector(selector);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        if (firstErrorField !== "coverImage" && firstErrorField !== "content") {
          element.focus();
        }
      }
    }
  };

  // ------------------------ SUBMIT NEWS HANDLER ------------------------
  const handleSubmitNews = async () => {
    try {
      setLoading(true);

      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });

      if (coverImageFile) payload.append("cover_image", coverImageFile);
      if (thumbnailFile) payload.append("thumbnail_url", thumbnailFile);

      galleryFiles.forEach((file) => {
        payload.append("gallery_images", file);
      });

      await createNewsApi(payload);

      Toaster.success("News Created Successfully");
      navigate("/news-list");
    } catch (err) {
      console.error(err);
      Toaster.error("Failed to create news");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle motherMenu="News" activeMenu="Add News" />
      <ToastContainer />
      <Loader visible={loading} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const err = validate();
          if (Object.keys(err).length) {
            setErrors(err);
            highlightEmptyFields(err);
            return;
          }
          handleSubmitNews();
        }}
      >
        <div className="row">
          {/* ---------------------- NEWS INFORMATION CARD ---------------------- */}
          <div className="col-xl-12 col-lg-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">News Information</h4>
              </div>
              <div className="card-body">
                {/* TITLE + BREAKING LINE */}
                <div className="row">
                  <div className="col-lg-6 mb-3">
                    <label className="form-label fw-semibold">Title *</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      placeholder="Enter news title"
                      value={formData.title}
                      onChange={handleInputChange}
                    />
                    {errors.title && (
                      <small className="text-danger">{errors.title}</small>
                    )}
                  </div>

                  <div className="col-lg-6 mb-3">
                    <label className="form-label fw-semibold">
                      Breaking Line *
                    </label>
                    <input
                      type="text"
                      name="breakingLine"
                      className="form-control"
                      placeholder="Enter breaking headline"
                      value={formData.breakingLine}
                      onChange={handleInputChange}
                    />
                    {errors.breakingLine && (
                      <small className="text-danger">
                        {errors.breakingLine}
                      </small>
                    )}
                  </div>
                </div>

                {/* SUMMARY */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Summary *</label>
                  <textarea
                    name="summary"
                    rows="4"
                    className="form-control"
                    placeholder="Add a short summary"
                    value={formData.summary}
                    onChange={handleInputChange}
                  />
                  {errors.summary && (
                    <small className="text-danger">{errors.summary}</small>
                  )}
                </div>

                {/* CONTENT */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Content *</label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={formData.content}
                    onChange={(_, editor) =>
                      setFormData((prev) => ({
                        ...prev,
                        content: editor.getData(),
                      }))
                    }
                  />
                  {errors.content && (
                    <small className="text-danger">{errors.content}</small>
                  )}
                </div>

                {/* CATEGORY + SUBCATEGORY */}
                <div className="row">
                  <div className="col-lg-6 mb-3">
                    <label className="form-label fw-semibold">Category *</label>
                    <select
                      className="form-select"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                    >
                      <option value="">Select category</option>
                      {newsCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {showCustomCategory && (
                      <input
                        type="text"
                        className="form-control mt-2"
                        placeholder="Enter custom category"
                        value={
                          formData.category === "Other" ? "" : formData.category
                        }
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                      />
                    )}
                    {errors.category && (
                      <small className="text-danger">{errors.category}</small>
                    )}
                  </div>

                  <div className="col-lg-6 mb-3">
                    <label className="form-label fw-semibold">
                      Sub Category *
                    </label>
                    <select
                      className="form-select"
                      name="subCategory"
                      value={formData.subCategory}
                      onChange={handleInputChange}
                    >
                      <option value="">Select sub category</option>
                      {formData.category &&
                      newsSubCategories[formData.category] ? (
                        newsSubCategories[formData.category].map(
                          (subCategory) => (
                            <option key={subCategory} value={subCategory}>
                              {subCategory}
                            </option>
                          )
                        )
                      ) : (
                        <option value="" disabled>
                          Select category first
                        </option>
                      )}
                    </select>
                    {showCustomSubCategory && (
                      <input
                        type="text"
                        className="form-control mt-2"
                        placeholder="Enter custom sub category"
                        value={
                          formData.subCategory === "Other"
                            ? ""
                            : formData.subCategory
                        }
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            subCategory: e.target.value,
                          }))
                        }
                      />
                    )}
                    {errors.subCategory && (
                      <small className="text-danger">
                        {errors.subCategory}
                      </small>
                    )}
                  </div>
                </div>

                {/* TAG + SLUG */}
                <div className="row">
                  <div className="col-lg-6 mb-3">
                    <label className="form-label fw-semibold">Tags *</label>
                    <select
                      className="form-select"
                      name="tag"
                      value={formData.tag}
                      onChange={handleInputChange}
                    >
                      <option value="">Select tag</option>
                      {newsTags.map((tag) => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                    {showCustomTag && (
                      <input
                        type="text"
                        className="form-control mt-2"
                        placeholder="Enter custom tag"
                        value={formData.tag === "Other" ? "" : formData.tag}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            tag: e.target.value,
                          }))
                        }
                      />
                    )}
                    {errors.tag && (
                      <small className="text-danger">{errors.tag}</small>
                    )}
                  </div>

                  <div className="col-lg-6 mb-3">
                    <label className="form-label fw-semibold">Slug *</label>
                    <input
                      type="text"
                      name="slug"
                      className="form-control"
                      placeholder="Auto-generated from title"
                      value={formData.slug}
                      onChange={handleInputChange}
                    />
                    {errors.slug && (
                      <small className="text-danger">{errors.slug}</small>
                    )}
                  </div>
                </div>

                {/* AUTHOR + LOCATION */}
                <div className="row">
                  <div className="col-lg-6 mb-3">
                    <label className="form-label fw-semibold">Author *</label>
                    <div className="input-group">
                      <select
                        className="form-select"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        disabled={authorsLoading}
                      >
                        <option value="">Select author</option>
                        {authors.map((author) => (
                          <option key={author._id} value={author._id}>
                            {author.name}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => setShowAuthorCard(true)}
                      >
                        <i className="fa fa-plus"></i>
                      </button>
                    </div>
                    {errors.author && (
                      <small className="text-danger">{errors.author}</small>
                    )}
                  </div>

                  <div className="col-lg-3 mb-3">
                    <label className="form-label fw-semibold">Location</label>
                    <input
                      type="text"
                      name="location"
                      className="form-control"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* READING TIME + REPORT SOURCE + SOURCE URL */}
                <div className="row">
                  <div className="col-lg-4 mb-3">
                    <label className="form-label fw-semibold">
                      Reading Time
                    </label>
                    <input
                      type="text"
                      name="readingTime"
                      className="form-control"
                      value={formData.readingTime}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-lg-4 mb-3">
                    <label className="form-label fw-semibold">
                      Report Source
                    </label>
                    <input
                      type="text"
                      name="reportSource"
                      className="form-control"
                      value={formData.reportSource}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-lg-4 mb-3">
                    <label className="form-label fw-semibold">Source URL</label>
                    <input
                      type="url"
                      name="sourceUrl"
                      className="form-control"
                      value={formData.sourceUrl}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* DATE FIELDS */}
                <div className="row">
                  <div className="col-lg-4 mb-3">
                    <label className="form-label fw-semibold">
                      Publish Date *
                    </label>
                    <input
                      type="date"
                      name="publishDate"
                      className="form-control"
                      value={formData.publishDate}
                      onChange={handleInputChange}
                    />
                    {errors.publishDate && (
                      <small className="text-danger">
                        {errors.publishDate}
                      </small>
                    )}
                  </div>

                  <div className="col-lg-4 mb-3">
                    <label className="form-label fw-semibold">
                      Expiry Date *
                    </label>
                    <input
                      type="date"
                      name="expiryDate"
                      className="form-control"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                    />
                    {errors.expiryDate && (
                      <small className="text-danger">{errors.expiryDate}</small>
                    )}
                  </div>

                  <div className="col-lg-4 mb-3">
                    <label className="form-label fw-semibold">
                      Schedule Time
                    </label>
                    <input
                      type="time"
                      name="scheduleTime"
                      className="form-control"
                      value={formData.scheduleTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------------- MEDIA INFORMATION CARD ---------------------- */}
          <div className="col-xl-12 col-lg-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Media Information</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  {/* COVER IMAGE */}
                  <div className="col-lg-6 col-md-6 mb-4">
                    <label className="form-label fw-semibold">
                      Cover Image *
                    </label>

                    <div
                      className="news-upload-box cover-upload"
                      style={{
                        height: "250px",
                        width: "100%",
                        maxWidth: "350px",
                        position: "relative",
                      }}
                    >
                      {coverImagePreview ? (
                        <>
                          <img
                            src={coverImagePreview}
                            className="news-preview-image"
                            alt="Cover Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <div className="upload-icon-overlay">
                            <i className="fa fa-upload"></i>
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            style={{
                              position: "absolute",
                              top: "5px",
                              right: "5px",
                            }}
                            onClick={clearCoverImage}
                          >
                            <i className="fa fa-times"></i>
                          </button>
                        </>
                      ) : (
                        <div className="upload-icon-center">
                          <i className="fa fa-upload fa-3x text-muted mb-2" />
                          <span className="text-muted d-block">
                            Upload cover image
                          </span>
                          <span className="text-muted small">
                            1200 × 628 recommended
                          </span>
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageChange}
                      />
                    </div>

                    {errors.coverImage && (
                      <small className="text-danger">{errors.coverImage}</small>
                    )}
                  </div>

                  {/* THUMBNAIL */}
                  <div className="col-lg-6 col-md-6 mb-4">
                    <label className="form-label fw-semibold">Thumbnail</label>

                    <div
                      className="news-upload-box thumbnail-upload"
                      style={{
                        height: "250px",
                        width: "100%",
                        maxWidth: "350px",
                        position: "relative",
                      }}
                    >
                      {thumbnailPreview ? (
                        <>
                          <img
                            src={thumbnailPreview}
                            className="news-preview-image"
                            alt="Thumbnail Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <div className="upload-icon-overlay">
                            <i className="fa fa-upload"></i>
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            style={{
                              position: "absolute",
                              top: "5px",
                              right: "5px",
                            }}
                            onClick={clearThumbnailImage}
                          >
                            <i className="fa fa-times"></i>
                          </button>
                        </>
                      ) : (
                        <div className="upload-icon-center">
                          <i className="fa fa-upload fa-3x text-muted mb-2" />
                          <span className="text-muted d-block">
                            Upload thumbnail
                          </span>
                          <span className="text-muted small">(optional)</span>
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                      />
                    </div>
                  </div>

                  {/* GALLERY IMAGES */}
                  <div className="row">
                    <div className="col-lg-12">
                      <label className="form-label fw-semibold">
                        Gallery Images
                      </label>

                      <div className="row">
                        <div className="col-md-12 mb-3">
                          <div className="gallery-upload-box gallery-upload text-center p-4 border border-2 border-dashed rounded">
                            <i className="fa fa-upload fa-3x text-muted mb-3"></i>
                            <span className="text-muted d-block mb-2">
                              Upload multiple images
                            </span>
                            <span className="text-muted small">
                              1200 × 628 recommended
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleGalleryChange}
                              className="mt-3"
                            />
                          </div>
                        </div>

                        <div className="col-md-12 mb-3">
                          <div className="gallery-preview-container">
                            {galleryPreviews.length > 0 ? (
                              <div className="row g-3">
                                {galleryPreviews.map((preview, index) => (
                                  <div
                                    className="col-6 col-sm-4 col-md-3 col-lg-2"
                                    key={index}
                                  >
                                    <div className="gallery-preview-item position-relative border rounded overflow-hidden">
                                      <img
                                        src={preview}
                                        className="gallery-preview-image w-100"
                                        alt={`Gallery ${index + 1}`}
                                        style={{
                                          height: "120px",
                                          objectFit: "cover",
                                        }}
                                      />
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-danger position-absolute"
                                        style={{
                                          top: "5px",
                                          right: "5px",
                                        }}
                                        onClick={() =>
                                          removeGalleryImage(index)
                                        }
                                      >
                                        <i className="fa fa-times"></i>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-muted text-center py-4">
                                No images added yet.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* VIDEO URL + EMBED CODE */}
                <div className="row mt-3">
                  <div className="col-lg-6 mb-3">
                    <label className="form-label fw-semibold">Video URL</label>
                    <input
                      type="text"
                      name="videoUrl"
                      className="form-control"
                      placeholder="https://youtu.be/..."
                      value={formData.videoUrl}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-lg-6 mb-3">
                    <label className="form-label fw-semibold">Embed Code</label>
                    <input
                      type="text"
                      name="embedCode"
                      className="form-control"
                      placeholder="<iframe ... />"
                      value={formData.embedCode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SAVE + CANCEL BUTTONS */}
            <div className="col-xl-12 col-lg-12">
              <div className="text-end">
                <button type="submit" className="btn btn-primary rounded-sm">
                  Save News
                </button>
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => navigate("/news-list")}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* ---------------------- AUTHOR MODAL ---------------------- */}
      <Modal
        show={showAuthorCard}
        onHide={() => setShowAuthorCard(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Author</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              const err = validateAuthorForm();
              if (Object.keys(err).length) {
                setAuthorErrors(err);
                return;
              }

              const payload = new FormData();
              payload.append("name", authorForm.name);
              payload.append("bio", authorForm.bio);
              payload.append(
                "social_links",
                JSON.stringify(authorForm.socialLinks)
              );
              if (authorProfileFile)
                payload.append("profile_image", authorProfileFile);

              setAuthorSubmitting(true);

              try {
                const response = await createAuthorApi(payload);
                const created = response?.data?.data;

                if (created?._id) {
                  setAuthors((prev) => [created, ...prev]);
                  setFormData((prev) => ({
                    ...prev,
                    author: created._id,
                  }));
                }

                Toaster.success("Author created successfully");
                setShowAuthorCard(false);
                // Reset form
                setAuthorForm(initialAuthorState);
                setAuthorProfileFile(null);
                setAuthorProfilePreview(null);
                setAuthorErrors({});
              } catch {
                Toaster.error("Failed to create author");
              } finally {
                setAuthorSubmitting(false);
              }
            }}
          >
            <div className="mb-3">
              <label className="form-label fw-semibold">Name *</label>
              <input
                type="text"
                className="form-control"
                value={authorForm.name}
                onChange={(e) =>
                  setAuthorForm((p) => ({ ...p, name: e.target.value }))
                }
              />
              {authorErrors.name && (
                <small className="text-danger">{authorErrors.name}</small>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Bio</label>
              <textarea
                className="form-control"
                rows="3"
                value={authorForm.bio}
                onChange={(e) =>
                  setAuthorForm((p) => ({ ...p, bio: e.target.value }))
                }
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Profile Image</label>
              <div className="border rounded p-3 text-center">
                {authorProfilePreview ? (
                  <div className="mb-2">
                    <img
                      src={authorProfilePreview}
                      alt="Profile Preview"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                ) : (
                  <div className="mb-2">
                    <i className="fa fa-upload fa-3x text-muted"></i>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setAuthorProfileFile(file);
                    setAuthorProfilePreview(URL.createObjectURL(file));
                  }}
                />
              </div>
            </div>

            <label className="form-label fw-semibold">Social Profiles</label>
            <div className="row g-3 mt-1">
              {Object.entries(authorForm.socialLinks).map(
                ([platform, value]) => (
                  <div className="col-6" key={platform}>
                    <label className="form-label">
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder={`https://${platform}.com/username`}
                      value={value}
                      onChange={(e) =>
                        setAuthorForm((prev) => ({
                          ...prev,
                          socialLinks: {
                            ...prev.socialLinks,
                            [platform]: e.target.value,
                          },
                        }))
                      }
                    />
                    {authorErrors[platform] && (
                      <small className="text-danger">
                        {authorErrors[platform]}
                      </small>
                    )}
                  </div>
                )
              )}
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            className="btn btn-light"
            onClick={() => setShowAuthorCard(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={authorSubmitting}
            onClick={(e) => {
              e.preventDefault();
              const form = e.target.closest("form");
              if (form) form.requestSubmit();
            }}
          >
            {authorSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Saving...
              </>
            ) : (
              "Save Author"
            )}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddNews;
