// import React, { useEffect, useState } from 'react';
// import { DatePicker } from 'rsuite';
// import Select from "react-select";

// import PageTitle from '../../layouts/PageTitle';
// import CustomClearIndicator from "../plugins/Select2/MultiSelect";
// import { getRolesApi } from '../../../services/apis/RolesApi';
// import { getZonesApi } from '../../../services/apis/ZoneApi';
// import { employeeCreateApi } from '../../../services/apis/EmployeeApi';
// import uplodIcon from '../../../assets/images/upload-icon.png'

// const AddEmployee = () => {
//     const [changeText, setChangeText] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
//     const [logo, setLogo] = useState(null);
//     const [cover, setCover] = useState(null);
//     const [selectedRoleOption, setSelectedRoleOption] = useState(null);
//     const [selectedZoneOption, setSelectedZoneOption] = useState(null);
//     const [roles, setRoles] = useState();
//     // const [zones, setZones] = useState();
//     const [formData, setFormData] = useState({
//         firstName: '',
//         lastName: '',
//         phone: '',
//         email: '',
//         password: '',
//         confirmPassword: '',

//     });
//     let errorsObj = { email: '', password: '', phone: '', firstName: '', lastName: '' };

//     const [errors, setErrors] = useState(errorsObj);

//     const fetchRoles = async () => {
//         try {
//             const res = await getRolesApi();
//             // Mapping roles data for dropdown format
//             const dropdownRoles = res.data?.roles.map(role => ({
//                 value: role._id,
//                 label: role.name
//             }));
//             // Now set the dropdown formatted data
//             setRoles(dropdownRoles);
//         } catch (error) {
//             //error goes here
//         }
//     }

//     useEffect(() => {
//      fetchRoles();
//     }, []);

//     // Handle the logo image change
//     const handleLogoChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = () => {
//                 setLogo(reader.result);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     // Handle image delete
//     const handleDeleteImage = () => {
//         setLogo(null); // Clear the image without reopening the file selector
//     };

//     // Handle the cover image change
//     const handleCoverChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = () => {
//              setCover(reader.result);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     // Validation logic for multiple fields
//     const validateFields = () => {
//         const errorObj = {
//             email: '',
//             password: '',
//             phone: '',
//             firstName: '',
//             lastName: '',
//         };
//         let isError = false;

//         // Email validation
//         if (!formData.email) {
//             errorObj.email = 'Email is required';
//             isError = true;
//         } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//             errorObj.email = 'Invalid email format';
//             isError = true;
//         }

//         // Password validation
//         if (!formData.password) {
//             errorObj.password = 'Password is required';
//             isError = true;
//         } else if (formData.password.length < 6) {
//             errorObj.password = 'Password must be at least 6 characters';
//             isError = true;
//         }

//         // Phone validation
//         if (!formData.phone) {
//             errorObj.phone = 'Phone number is required';
//             isError = true;
//         } else if (!/^\d{10}$/.test(formData.phone)) {
//             errorObj.phone = 'Phone number must be 10 digits';
//             isError = true;
//         }

//         // Firstname validation
//         if (!formData.firstName) {
//             errorObj.firstName = 'First name is required';
//             isError = true;
//         }

//         // Lastname validation
//         if (!formData.lastName) {
//             errorObj.lastName = 'Last name is required';
//             isError = true;
//         }

//         setErrors(errorObj); // Set the validation errors
//         return isError; // Return if there's any error
//     };

//     // const handleInputChange = (e) => {
//     //     const { name, value } = e.target;
//     //     setFormData((prevState) => ({
//     //         ...prevState,
//     //         [name]: value,
//     //     }));
//     // };
//     const handleInputChange = (e, field) => {
//         const { name, value } = e.target;

//         // Update form data
//         setFormData((prevState) => ({
//             ...prevState,
//             [name]: value,
//         }));

//         // Reset specific field error when the user starts typing
//         if (field === 'email') {
//             // Custom validation for email field
//             if (errors.email) {
//                 setErrors(prevErrors => ({ ...prevErrors, email: '' }));
//             }
//         } else if (field === 'password') {
//             // Custom validation for password field
//             if (errors.password) {
//                 setErrors(prevErrors => ({ ...prevErrors, password: '' }));
//             }
//         } else if (field === 'phone') {
//             // Custom validation for phone field
//             if (errors.phone) {
//                 setErrors(prevErrors => ({ ...prevErrors, phone: '' }));
//             }
//         } else if (field === 'firstName') {
//             // Custom validation for firstname field
//             if (errors.firstName) {
//                 setErrors(prevErrors => ({ ...prevErrors, firstName: '' }));
//             }
//         } else if (field === 'lastname') {
//             // Custom validation for lastname field
//             if (errors.lastName) {
//                 setErrors(prevErrors => ({ ...prevErrors, lastName: '' }));
//             }
//         }
//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (validateFields()) {
//             return;
//         }

//         const employeeData = {
//             firstName: formData.firstName,
//             lastName: formData.lastName,
//             phone: formData.phone,
//             email: formData.email,
//             password: formData.password,
//             confirmPassword: formData.confirmPassword,
//             role_id: selectedRoleOption?.value,
//             role: '67512dff137352f05356ff3c',
//             logo,

//         };

//         const res = await employeeCreateApi(employeeData);
//         console.log("response is here", res);

//         // Add your form submission logic here, e.g., making an API call with employeeData.
//         console.log('Form Submitted:', employeeData);
//     };

//     const handleDeleteLogo = () => {
//         setLogo(null);
//         document.getElementById("logoUpload").value = ""; // Reset file input
//     };

//     // Inline styles
//     const styles = {
//         container: {
//             border: '2px dashed #ccc',
//             borderRadius: '8px',
//             width: '150px', // Logo size
//             height: '150px',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             cursor: 'pointer',
//             backgroundColor: '#f9f9f9',
//             position: 'relative',
//             textAlign: 'center',
//             overflow: 'hidden',
//         },
//         coverContainer: {
//             border: '2px dashed #ccc',
//             borderRadius: '8px',
//             width: '300px', // Cover size (2:1 ratio)
//             height: '150px',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             cursor: 'pointer',
//             backgroundColor: '#f9f9f9',
//             position: 'relative',
//             textAlign: 'center',
//             overflow: 'hidden',
//         },
//         placeholder: {
//             width: '100%',
//             height: '100%',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             position: 'relative',
//             textAlign: 'center',
//         },
//         img: {
//             width: '100%',
//             height: '100%',
//             objectFit: 'cover',
//             borderRadius: '8px',
//         },
//         hover: {
//             borderColor: '#007bff',
//             backgroundColor: '#e9f4ff',
//         },
//         uploadIcon: {
//             color: '#888',
//             fontSize: '16px',
//             fontWeight: 'bold',
//         },
//         deleteIcon: {
//             position: 'absolute',
//             top: '0px',
//             right: '0px',
//             backgroundColor: '#FF6D6D',
//             color: 'white',
//             borderRadius: '100%',
//             padding: '5px 10px',
//             cursor: 'pointer',
//             zIndex: 2,
//             fontSize: '10px',
//             fontWeight: 'bold',
//         }
//     };
//     return (
//         <>
//             <PageTitle activeMenu={"Add new Employee"} motherMenu={"Employees"} />
//             <div className="row">
//                 {/* SECTION 1st Genaral Information */}
//                 <div className="col-xl-12 col-lg-12">
//                     <div className="card">
//                         <div className="card-header">
//                             <h4 className="card-title">Genaral Information</h4>
//                         </div>
//                         <div className="card-body">
//                             <div className="row">
//                                 <div className="col-sm-12 col-md-8  row">
//                                     <div className="col-sm-6">
//                                         <label className="col-form-label">First Name</label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             placeholder="Ex: John"
//                                             name="firstName"
//                                             value={formData.firstName}
//                                             onChange={handleInputChange}
//                                         />
//                                         {errors.firstName && <div className="text-danger fs-12">{errors.firstName}</div>}
//                                     </div>

//                                     <div className="col-sm-6 mt-2 mt-sm-0">
//                                         <label className="col-form-label">Last Name</label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="lastName"
//                                             value={formData.lastName}
//                                             onChange={handleInputChange}
//                                             placeholder="Ex: Doe"
//                                         />
//                                         {errors.lastName && <div className="text-danger fs-12">{errors.lastName}</div>}
//                                     </div>

//                                     <div className="col-sm-6">
//                                         <label className="col-form-label">
//                                          Role
//                                         </label>
//                                         <Select
//                                             defaultValue={selectedRoleOption}
//                                             onChange={setSelectedRoleOption}
//                                             options={roles}
//                                             style={{
//                                                 lineHeight: "40px",
//                                                 color: "#7e7e7e",
//                                                 paddingLeft: " 15px",
//                                             }}
//                                         />
//                                     </div>

//                                     <div className="col-sm-6 mt-2 mt-sm-0">
//                                         <label className="col-form-label">Phone</label>
//                                         <input
//                                             type="number"
//                                             className="form-control"
//                                             name="phone"
//                                             value={formData.phone}
//                                             onChange={(e) => {
//                                                 const value = e.target.value;
//                                                 // Validate only numbers and enforce maxLength of 10 digits
//                                                 if (/^\d*$/.test(value) && value.length <= 10) {
//                                                     handleInputChange(e);
//                                                 }
//                                             }}
//                                             placeholder="Ex: +9XXX-XXX-XXXX"
//                                             maxLength={10}
//                                         />
//                                         {errors.phone && <div className="text-danger fs-12">{errors.phone}</div>}
//                                     </div>
//                                 </div>

//                                 <div className="col-sm-6 col-md-4 flex justify-center items-center">
//                                     {/* <div className="col-sm-12">
//                                         <label className="col-form-label">Employee image</label>
//                                         <div style={{ position: 'relative', ...styles.container }}>
//                                             <input
//                                                 type="file"
//                                                 accept="image/*"
//                                                 onChange={handleLogoChange}
//                                                 style={{ display: 'none' }}
//                                                 id="logoUpload"
//                                             />
//                                             <label htmlFor="logoUpload" style={styles.placeholder}>
//                                                 {logo ? (
//                                                     <div style={{ position: 'relative' }}>
//                                                         <img src={logo} alt="Logo" style={styles.img} />
//                                                         <button
//                                                             onClick={handleDeleteImage}  // Clear the image
//                                                             style={{
//                                                                 position: 'absolute',
//                                                                 top: 0,
//                                                                 right: 0,
//                                                                 background: 'red',
//                                                                 color: 'white',
//                                                                 border: 'none',
//                                                                 borderRadius: '50%',
//                                                                 width: '25px',
//                                                                 height: '25px',
//                                                                 cursor: 'pointer'
//                                                             }}>
//                                                             &times;
//                                                         </button>
//                                                     </div>
//                                                 ) : (
//                                                     <div style={styles.uploadIcon}>Upload Image</div>
//                                                 )}
//                                             </label>
//                                         </div>
//                                         <p>
//                                             Image format - jpg png jpeg gif<br />
//                                             Image Size - maximum size 2 MB<br />
//                                             Image Ratio - 1:1
//                                         </p>
//                                     </div> */}

//                                     <div className="col-sm-12" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
//                                         <label className="col-form-label">Employee Image</label>
//                                         <div style={styles.container}>
//                                             <input
//                                                 type="file"
//                                                 accept="image/*"
//                                                 onChange={handleLogoChange}
//                                                 style={{ display: 'none' }}
//                                                 id="logoUpload"
//                                             />
//                                             {logo ? (
//                                                 <>
//                                                  {/* Simple 'X' button as the delete icon */}
//                                                  <div style={styles.deleteIcon} onClick={handleDeleteLogo}>
//                                                      ⛌
//                                                  </div>
//                                                  <img src={logo} alt="Logo" style={styles.img} />
//                                                 </>
//                                             ) : (
//                                                 <label htmlFor="logoUpload" style={styles.placeholder}>
//                                                   <div style={styles.uploadIcon} className='flex flex-col cursor-pointer'>
//                                                     <img width="30" src={uplodIcon} alt="Upload Icon"></img>
//                                                     <p>Upload Image</p>
//                                                   </div>
//                                                 </label>
//                                             )}
//                                         </div>
//                                         <p className='mt-2'>Image format - jpg png jpeg gif<br />Image Size - maximum size 2 MB<br />Image Ratio - 1:1</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* SECTION 2nd Account Info*/}
//                 <div className="col-xl-12 col-lg-12">
//                     <div className="card">
//                         <div className="card-header">
//                             <h4 className="card-title">Account Info</h4>
//                         </div>
//                         <div className="card-body">
//                             <div className="row">
//                                 <div className="col-sm-4">
//                                     <label className="col-form-label">Email</label>
//                                     <input
//                                         type="email"
//                                         className="form-control"
//                                         placeholder="Ex: John@company.com"
//                                         name='email'
//                                         value={formData.email}
//                                         onChange={handleInputChange}
//                                     />
//                                     {errors.email && <div className="text-danger fs-12">{errors.email}</div>}
//                                 </div>
//                                 <div className="col-sm-4 mt-2 mt-sm-0">
//                                     <label className="col-form-label">Password</label>
//                                     <div className="input-group pass-group">
//                                         <input
//                                             placeholder="Password"
//                                             id="password"
//                                             type={showPassword ? "text" : "password"}
//                                             className="form-control pass-input"
//                                             required
//                                             name="password"
//                                             value={formData.password}
//                                             onChange={handleInputChange}
//                                         />
//                                         <span className={`input-group-text pass-handle ${showPassword ? "active" : ""}`}
//                                             onClick={() => setShowPassword(!showPassword)}>
//                                             <i className="fa fa-eye-slash" />
//                                             <i className="fa fa-eye" />
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <div className="col-sm-4 mt-2 mt-sm-0">
//                                     <label className="col-form-label">Confirm Password</label>
//                                     <div className="input-group pass-group">
//                                         <input
//                                             placeholder="Confirm Password"
//                                             id="confirm_password"
//                                             type={changeText ? "text" : "password"}
//                                             className="form-control pass-input"
//                                             required
//                                             name="confirmPassword"
//                                             value={formData.confirmPassword}
//                                             onChange={handleInputChange}
//                                         />

//                                         <span className={`input-group-text pass-handle ${changeText ? "active" : ""}`}
//                                             onClick={() => setChangeText(!changeText)}>
//                                             <i className="fa fa-eye-slash" />
//                                             <i className="fa fa-eye" />
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 {/* Section Submit button */}
//                 <div className="text-end">
//                     <button type="submit" onClick={handleSubmit} className="btn btn-primary rounded-sm">Save Information</button>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default AddEmployee;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ToastContainer } from "react-toastify";

import PageTitle from "../../layouts/PageTitle";
import Loader from "../../components/Loader/Loader";
import { Toaster } from "../../components/Toaster/Toster";

import { createNewsApi } from "../../../services/newsApi";
import { createAuthorApi, getAuthorsApi } from "../../../services/authorApi";
import "./news.css";

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

    setFormData((prev) => {
      if (name === "title") {
        const next = { ...prev, title: value };
        if (!prev.slug) next.slug = slugify(value);
        return next;
      }
      if (name === "slug") return { ...prev, slug: slugify(value) };

      return { ...prev, [name]: value };
    });
  };

  // ------------------------ MEDIA HANDLING ------------------------
  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverImageFile(file);
    setCoverImagePreview(URL.createObjectURL(file));

    if (!thumbnailFile) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
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

  // ------------------------ SUBMIT NEWS HANDLER ------------------------
  const handleSubmitNews = async () => {
    try {
      setLoading(true);

      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });

      if (coverImageFile) payload.append("cover_image", coverImageFile);
      if (thumbnailFile) payload.append("thumbnail", thumbnailFile);

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

      <div className="container-fluid">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const err = validate();
            if (Object.keys(err).length) {
              setErrors(err);
              return;
            }
            handleSubmitNews();
          }}
        >
          <div className="row">
            {/* ---------------------- NEWS INFORMATION CARD ---------------------- */}
            <div className="col-xl-12 col-lg-12">
              <div className="card mb-4">
                <div className="card-header">
                  <h4 className="card-title mb-0">News Information</h4>
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
                      <label className="form-label fw-semibold">
                        Category *
                      </label>
                      <input
                        type="text"
                        name="category"
                        className="form-control"
                        value={formData.category}
                        onChange={handleInputChange}
                      />
                      {errors.category && (
                        <small className="text-danger">{errors.category}</small>
                      )}
                    </div>

                    <div className="col-lg-6 mb-3">
                      <label className="form-label fw-semibold">
                        Sub Category *
                      </label>
                      <input
                        type="text"
                        name="subCategory"
                        className="form-control"
                        value={formData.subCategory}
                        onChange={handleInputChange}
                      />
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
                      <input
                        type="text"
                        name="tag"
                        className="form-control"
                        placeholder="Example: Sports, Cricket"
                        value={formData.tag}
                        onChange={handleInputChange}
                      />
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
                    <div className="col-lg-9 mb-3">
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
                      <label className="form-label fw-semibold">
                        Source URL
                      </label>
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
                        <small className="text-danger">
                          {errors.expiryDate}
                        </small>
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
              <div className="card mb-4">
                <div className="card-header">
                  <h4 className="card-title mb-0">Media Information</h4>
                </div>

                <div className="card-body">
                  <div className="row">
                    {/* COVER IMAGE */}
                    <div className="col-lg-6 mb-4">
                      <label className="form-label fw-semibold">
                        Cover Image *
                      </label>

                      <div className="news-upload-box">
                        {coverImagePreview ? (
                          <>
                            <img
                              src={coverImagePreview}
                              className="news-preview-image"
                              alt="Cover Preview"
                            />
                            <div className="upload-icon-overlay">
                              <i className="fa fa-upload"></i>
                            </div>
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
                        <small className="text-danger">
                          {errors.coverImage}
                        </small>
                      )}
                    </div>

                    {/* THUMBNAIL */}
                    <div className="col-lg-6 mb-4">
                      <label className="form-label fw-semibold">
                        Thumbnail
                      </label>

                      <div className="news-upload-box">
                        {thumbnailPreview ? (
                          <>
                            <img
                              src={thumbnailPreview}
                              className="news-preview-image"
                              alt="Thumbnail Preview"
                            />
                            <div className="upload-icon-overlay">
                              <i className="fa fa-upload"></i>
                            </div>
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
                    <div className="col-lg-12">
                      <label className="form-label fw-semibold">
                        Gallery Images
                      </label>

                      <div className="row">
                        <div className="col-md-3 mb-3">
                          <div className="gallery-upload-box">
                            <i className="fa fa-upload fa-2x text-muted mb-2"></i>
                            <span className="text-muted small">
                              Upload images
                            </span>

                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleGalleryChange}
                            />
                          </div>
                        </div>

                        <div className="col-md-9 mb-3">
                          <div className="gallery-preview-container">
                            {galleryPreviews.length > 0 ? (
                              <div className="row g-2">
                                {galleryPreviews.map((preview, index) => (
                                  <div className="col-4 col-md-3" key={index}>
                                    <div className="gallery-preview-item">
                                      <img
                                        src={preview}
                                        className="gallery-preview-image"
                                        alt="Gallery"
                                      />

                                      <button
                                        type="button"
                                        className="gallery-remove-btn"
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
                              <div className="text-muted">
                                No images added yet.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* VIDEO URL + EMBED CODE */}
                  <div className="row mt-3">
                    <div className="col-lg-6 mb-3">
                      <label className="form-label fw-semibold">
                        Video URL
                      </label>
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
                      <label className="form-label fw-semibold">
                        Embed Code
                      </label>
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

                  {/* SAVE + CANCEL BUTTONS */}
                  <div className="d-flex gap-3 mt-4">
                    <button type="submit" className="btn btn-primary">
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
          </div>
        </form>

        {/* ---------------------- AUTHOR POPUP CARD ---------------------- */}
        {showAuthorCard && (
          <div className="author-card-overlay">
            <div className="card author-card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Create Author</h5>

                <button
                  type="button"
                  className="btn btn-sm btn-light"
                  onClick={() => setShowAuthorCard(false)}
                >
                  <i className="fa fa-times"></i>
                </button>
              </div>

              <div className="card-body">
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
                    <label className="form-label fw-semibold">
                      Profile Image
                    </label>

                    <div className="author-profile-upload">
                      {authorProfilePreview ? (
                        <img
                          src={authorProfilePreview}
                          className="author-profile-preview"
                          alt="Preview"
                        />
                      ) : (
                        <div className="upload-icon-center">
                          <i className="fa fa-upload fa-2x text-muted"></i>
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          setAuthorProfileFile(file);
                          setAuthorProfilePreview(URL.createObjectURL(file));
                        }}
                      />
                    </div>
                  </div>

                  <label className="form-label fw-semibold">
                    Social Profiles
                  </label>
                  <div className="row g-3 mt-1">
                    {Object.entries(authorForm.socialLinks).map(
                      ([platform, value]) => (
                        <div className="col-6" key={platform}>
                          <label className="form-label">
                            {platform.charAt(0).toUpperCase() +
                              platform.slice(1)}
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

                  <div className="d-flex justify-content-end gap-2 mt-4">
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
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddNews;
