// ========================= FIXED EditNews.js =========================

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ToastContainer } from "react-toastify";
import { Modal } from "react-bootstrap"; // ⭐ ADDED IMPORTANT IMPORT

import PageTitle from "../../layouts/PageTitle";
import Loader from "../../components/Loader/Loader";
import { Toaster } from "../../components/Toaster/Toster";

import { updateNewsApi, getNewsByIdApi } from "../../../services/newsApi";
import { createAuthorApi, getAuthorsApi } from "../../../services/authorApi";
import apis from "../../../services/apis";

// ---------------- CATEGORIES ----------------------------------
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

// ---------------- Initial Form States ----------------
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

// ---------------- Slug Generator ----------------
const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

// =======================================================================
// ======================= MAIN COMPONENT START ===========================
// =======================================================================

const EditNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // ---------------- Media States ----------------
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [existingCoverImage, setExistingCoverImage] = useState(null);

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [existingThumbnail, setExistingThumbnail] = useState(null);

  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);

  // ---------------- Author States ----------------
  const [authors, setAuthors] = useState([]);
  const [authorsLoading, setAuthorsLoading] = useState(false);
  const [showAuthorCard, setShowAuthorCard] = useState(false); // ⭐ IMPORTANT
  const [authorForm, setAuthorForm] = useState(initialAuthorState);
  const [authorErrors, setAuthorErrors] = useState({});
  const [authorProfileFile, setAuthorProfileFile] = useState(null);
  const [authorProfilePreview, setAuthorProfilePreview] = useState(null);
  const [authorSubmitting, setAuthorSubmitting] = useState(false);

  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [showCustomSubCategory, setShowCustomSubCategory] = useState(false);

  // =======================================================================
  // ====================== FETCH NEWS BY ID ===============================
  // =======================================================================

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getNewsByIdApi(id);
        const news = response?.data?.data;

        if (news) {
          setFormData({
            title: news.title,
            breakingLine: news.breaking_line,
            summary: news.summary,
            content: news.content,
            category: news.category,
            subCategory: news.sub_category,
            tag: Array.isArray(news.tags) ? news.tags.join(", ") : news.tags,
            slug: news.slug,
            author: news.author?._id || "",
            location: news.location,
            readingTime: news.reading_time,
            reportSource: news.report_source,
            sourceUrl: news.source_url,
            publishDate: news.publish_date
              ? new Date(news.publish_date).toISOString().split("T")[0]
              : "",
            expiryDate: news.expiry_date
              ? new Date(news.expiry_date).toISOString().split("T")[0]
              : "",
            scheduleTime: news.schedule_time
              ? new Date(news.schedule_time).toTimeString().slice(0, 5)
              : "",
            videoUrl: news.video_url,
            embedCode: news.embed_code,
            status: news.status,
          });

          if (news.cover_image) {
            setExistingCoverImage(news.cover_image);
            setCoverImagePreview(
              `${apis.baseurl.newsImageBase}${news.cover_image}`
            );
          }
          if (news.thumbnail_url) {
            setExistingThumbnail(news.thumbnail_url);
            setThumbnailPreview(
              `${apis.baseurl.newsImageBase}${news.thumbnail_url}`
            );
          }

          if (news.gallery_images) {
            setExistingGallery(news.gallery_images);
            setGalleryPreviews(
              news.gallery_images.map(
                (img) => `${apis.baseurl.newsImageBase}${img}`
              )
            );
          }
        }
      } catch (error) {
        Toaster.error("Unable to load news data");
        navigate("/news-list");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  // =======================================================================
  // =========================== LOAD AUTHORS ===============================
  // =======================================================================

  useEffect(() => {
    const loadAuthors = async () => {
      setAuthorsLoading(true);
      try {
        const res = await getAuthorsApi();
        setAuthors(res?.data?.data || []);
      } catch {
        Toaster.error("Failed to load authors");
      }
      setAuthorsLoading(false);
    };

    loadAuthors();
  }, []);

  // =======================================================================
  // =========================== VALIDATION =================================
  // =======================================================================

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

    return err;
  };

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

  // =======================================================================
  // ======================== HIGHLIGHT EMPTY FIELDS ======================
  // =======================================================================

  const highlightEmptyFields = (errors) => {
    // Remove previous highlights
    document.querySelectorAll(".field-error-highlight").forEach((el) => {
      el.classList.remove("field-error-highlight");
    });

    // Add highlights to empty required fields
    Object.keys(errors).forEach((fieldName) => {
      const element = document.querySelector(`[name="${fieldName}"]`);
      if (element) {
        element.classList.add("field-error-highlight");
      }
    });

    // Focus on first error field
    const errorFields = Object.keys(errors);
    if (errorFields.length > 0) {
      const firstErrorField = errorFields[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
    }
  };

  // =======================================================================
  // ======================== HANDLE INPUT CHANGES ==========================
  // =======================================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === "title") {
        const next = { ...prev, title: value };
        if (!prev.slug) next.slug = slugify(value);
        return next;
      }
      if (name === "slug") return { ...prev, slug: slugify(value) };

      if (name === "category") setShowCustomCategory(value === "Other");
      if (name === "subCategory") setShowCustomSubCategory(value === "Other");

      return { ...prev, [name]: value };
    });
  };

  // =======================================================================
  // ======================== MEDIA FUNCTIONS ===============================
  // =======================================================================

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverImageFile(file);
    setCoverImagePreview(URL.createObjectURL(file));
    setExistingCoverImage(null);
  };

  const clearCoverImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview(null);
    setExistingCoverImage(null);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
    setExistingThumbnail(null);
  };

  const clearThumbnailImage = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setExistingThumbnail(null);
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setGalleryFiles((prev) => [...prev, ...files]);
    setGalleryPreviews((prev) => [...prev, ...previews]);
  };

  const removeGalleryImage = (index) => {
    if (index < existingGallery.length) {
      setExistingGallery((prev) => prev.filter((_, i) => i !== index));
      setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    } else {
      const newIndex = index - existingGallery.length;
      setGalleryFiles((prev) => prev.filter((_, i) => i !== newIndex));
      setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // =======================================================================
  // =========================== SUBMIT NEWS ================================
  // =======================================================================

  const handleSubmitNews = async () => {
    try {
      setLoading(true);
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) =>
        payload.append(key, value)
      );

      // Cover
      if (coverImageFile) payload.append("cover_image", coverImageFile);
      else if (existingCoverImage)
        payload.append("cover_image", existingCoverImage);

      // Thumbnail
      if (thumbnailFile) payload.append("thumbnail_url", thumbnailFile);
      else if (existingThumbnail)
        payload.append("thumbnail_url", existingThumbnail);

      // Gallery Images
      const allGallery = [
        ...existingGallery,
        ...galleryFiles.map((f) => f.name || f),
      ];
      payload.append("existing_gallery_images", JSON.stringify(allGallery));

      galleryFiles.forEach((file) => payload.append("gallery_images", file));

      await updateNewsApi(id, payload);
      Toaster.success("News Updated Successfully");
      navigate("/news-list");
    } catch (err) {
      Toaster.error("Failed to update news");
    } finally {
      setLoading(false);
    }
  };

  // =======================================================================
  // ====================== RETURN UI ======================================
  // =======================================================================

  if (fetchLoading) {
    return (
      <>
        <PageTitle motherMenu="News" activeMenu="Edit News" />
        <Loader visible={true} />
      </>
    );
  }

  return (
    <>
      <PageTitle motherMenu="News" activeMenu="Edit News" />
      <ToastContainer />
      <Loader visible={loading} />

      {/* ========================= FORM ====================== */}
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
        {/* ======= NEWS INFO CARD ======= */}
        <div className="row">
          <div className="col-xl-12 col-lg-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">News Information</h4>
              </div>
              <div className="card-body">
                {/* Title + Breaking Line */}
                <div className="row">
                  <div className="col-lg-6 mb-3">
                    <label>Title *</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      value={formData.title}
                      onChange={handleInputChange}
                    />
                    {errors.title && (
                      <small className="text-danger">{errors.title}</small>
                    )}
                  </div>

                  <div className="col-lg-6 mb-3">
                    <label>Breaking Line *</label>
                    <input
                      type="text"
                      name="breakingLine"
                      className="form-control"
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

                {/* Summary */}
                <div className="mb-3">
                  <label>Summary *</label>
                  <textarea
                    name="summary"
                    rows="4"
                    className="form-control"
                    value={formData.summary}
                    onChange={handleInputChange}
                  ></textarea>
                  {errors.summary && (
                    <small className="text-danger">{errors.summary}</small>
                  )}
                </div>

                {/* Content */}
                <div className="mb-3">
                  <label>Content *</label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={formData.content}
                    onChange={(_, editor) =>
                      setFormData({ ...formData, content: editor.getData() })
                    }
                  />
                  {errors.content && (
                    <small className="text-danger">{errors.content}</small>
                  )}
                </div>

                {/* Category */}
                <div className="row">
                  <div className="col-lg-6 mb-3">
                    <label>Category *</label>
                    <select
                      name="category"
                      className="form-select"
                      value={formData.category}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      {newsCategories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>

                    {showCustomCategory && (
                      <input
                        type="text"
                        className="form-control mt-2"
                        placeholder="Custom category"
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                      />
                    )}
                    {errors.category && (
                      <small className="text-danger">{errors.category}</small>
                    )}
                  </div>

                  {/* Sub Category */}
                  <div className="col-lg-6 mb-3">
                    <label>Sub Category *</label>
                    <select
                      name="subCategory"
                      className="form-select"
                      value={formData.subCategory}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>

                      {formData.category &&
                      newsSubCategories[formData.category] ? (
                        newsSubCategories[formData.category].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))
                      ) : (
                        <option disabled>Select category first</option>
                      )}
                    </select>

                    {showCustomSubCategory && (
                      <input
                        type="text"
                        className="form-control mt-2"
                        placeholder="Custom sub category"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            subCategory: e.target.value,
                          })
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

                {/* Tags + Slug */}
                <div className="row">
                  <div className="col-lg-6 mb-3">
                    <label>Tags *</label>
                    <input
                      type="text"
                      name="tag"
                      className="form-control"
                      value={formData.tag}
                      onChange={handleInputChange}
                    />
                    {errors.tag && (
                      <small className="text-danger">{errors.tag}</small>
                    )}
                  </div>

                  <div className="col-lg-6 mb-3">
                    <label>Slug *</label>
                    <input
                      type="text"
                      name="slug"
                      className="form-control"
                      value={formData.slug}
                      onChange={handleInputChange}
                    />
                    {errors.slug && (
                      <small className="text-danger">{errors.slug}</small>
                    )}
                  </div>
                </div>

                {/* Author */}
                <div className="row">
                  <div className="col-lg-6 mb-3">
                    <label>Author *</label>
                    <div className="input-group">
                      <select
                        className="form-select"
                        name="author"
                        value={formData.author}
                        disabled={authorsLoading}
                        onChange={handleInputChange}
                      >
                        <option value="">Select author</option>
                        {authors.map((a) => (
                          <option key={a._id} value={a._id}>
                            {a.name}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => setShowAuthorCard(true)} // ⭐ FIXED
                      >
                        <i className="fa fa-plus"></i>
                      </button>
                    </div>
                    {errors.author && (
                      <small className="text-danger">{errors.author}</small>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="col-lg-3 mb-3">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Reading, Report Source, Source URL */}
                <div className="row">
                  <div className="col-lg-4 mb-3">
                    <label>Reading Time</label>
                    <input
                      type="text"
                      name="readingTime"
                      className="form-control"
                      value={formData.readingTime}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-lg-4 mb-3">
                    <label>Report Source</label>
                    <input
                      type="text"
                      name="reportSource"
                      className="form-control"
                      value={formData.reportSource}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-lg-4 mb-3">
                    <label>Source URL</label>
                    <input
                      type="text"
                      name="sourceUrl"
                      className="form-control"
                      value={formData.sourceUrl}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Date fields */}
                <div className="row">
                  <div className="col-lg-4 mb-3">
                    <label>Publish Date *</label>
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
                    <label>Expiry Date *</label>
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
                    <label>Schedule Time</label>
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

          {/* ========================= MEDIA CARD ======================== */}
          <div className="col-xl-12 col-lg-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Media Information</h4>
              </div>

              <div className="card-body">
                <div className="row">
                  {/* Cover */}
                  <div className="col-lg-6 mb-4">
                    <label>Cover Image *</label>

                    <div
                      className="news-upload-box"
                      style={{
                        height: "250px",
                        maxWidth: "350px",
                        position: "relative",
                      }}
                    >
                      {coverImagePreview ? (
                        <>
                          <img
                            src={coverImagePreview}
                            alt="preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <button
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
                          <span>Upload 1200 × 628</span>
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

                  {/* Thumbnail */}
                  <div className="col-lg-6 mb-4">
                    <label>Thumbnail</label>
                    <div
                      className="news-upload-box"
                      style={{
                        height: "250px",
                        maxWidth: "350px",
                        position: "relative",
                      }}
                    >
                      {thumbnailPreview ? (
                        <>
                          <img
                            src={thumbnailPreview}
                            alt="thumb"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <button
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
                          <span>Upload Thumbnail</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                      />
                    </div>
                  </div>

                  {/* Gallery */}
                  <div className="col-lg-12">
                    <label>Gallery Images</label>
                    <div className="row">
                      <div className="col-md-3 mb-3">
                        <div className="gallery-upload-box">
                          <i className="fa fa-upload fa-2x"></i>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleGalleryChange}
                          />
                        </div>
                      </div>

                      <div className="col-md-9 mb-3">
                        <div className="row g-2">
                          {galleryPreviews.length > 0 ? (
                            galleryPreviews.map((preview, index) => (
                              <div className="col-3 col-md-2" key={index}>
                                <div className="gallery-preview-item">
                                  <img
                                    src={preview}
                                    style={{
                                      height: "80px",
                                      objectFit: "cover",
                                    }}
                                  />
                                  <button
                                    className="gallery-remove-btn"
                                    onClick={() => removeGalleryImage(index)}
                                  >
                                    <i className="fa fa-times"></i>
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-muted">No images added yet</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video URL + Embed */}
                <div className="row mt-3">
                  <div className="col-lg-6 mb-3">
                    <label>Video URL</label>
                    <input
                      type="text"
                      name="videoUrl"
                      className="form-control"
                      value={formData.videoUrl}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-lg-6 mb-3">
                    <label>Embed Code</label>
                    <input
                      type="text"
                      name="embedCode"
                      className="form-control"
                      value={formData.embedCode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save + Cancel */}
            <div className="col-xl-12 text-end mb-5">
              <button type="submit" className="btn btn-primary">
                Update News
              </button>
              <button
                type="button"
                className="btn btn-light ms-2"
                onClick={() => navigate("/news-list")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* =====================================================================
          ========================= AUTHOR MODAL ==============================
          ===================================================================== */}

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
              if (Object.keys(err).length) return setAuthorErrors(err);

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
                  setFormData((prev) => ({ ...prev, author: created._id }));
                }

                Toaster.success("Author created successfully");
                setShowAuthorCard(false);

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
              <label>Name *</label>
              <input
                type="text"
                className="form-control"
                value={authorForm.name}
                onChange={(e) =>
                  setAuthorForm({ ...authorForm, name: e.target.value })
                }
              />
              {authorErrors.name && (
                <small className="text-danger">{authorErrors.name}</small>
              )}
            </div>

            <div className="mb-3">
              <label>Bio</label>
              <textarea
                className="form-control"
                rows="3"
                value={authorForm.bio}
                onChange={(e) =>
                  setAuthorForm({ ...authorForm, bio: e.target.value })
                }
              ></textarea>
            </div>

            <div className="mb-3">
              <label>Profile Image</label>
              <div className="border rounded p-3 text-center">
                {authorProfilePreview ? (
                  <img
                    src={authorProfilePreview}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <i className="fa fa-upload fa-3x text-muted"></i>
                )}
                <input
                  type="file"
                  className="form-control mt-2"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setAuthorProfileFile(file);
                    setAuthorProfilePreview(URL.createObjectURL(file));
                  }}
                />
              </div>
            </div>

            <label>Social Profiles</label>
            <div className="row g-3 mt-1">
              {Object.entries(authorForm.socialLinks).map(
                ([platform, value]) => (
                  <div className="col-6" key={platform}>
                    <label>
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder={`https://${platform}.com/username`}
                      value={value}
                      onChange={(e) =>
                        setAuthorForm({
                          ...authorForm,
                          socialLinks: {
                            ...authorForm.socialLinks,
                            [platform]: e.target.value,
                          },
                        })
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
            className="btn btn-light"
            onClick={() => setShowAuthorCard(false)}
          >
            Cancel
          </button>

          <button
            className="btn btn-primary"
            disabled={authorSubmitting}
            onClick={(e) => {
              e.preventDefault();
              const form = document.querySelector("form");
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

export default EditNews;
