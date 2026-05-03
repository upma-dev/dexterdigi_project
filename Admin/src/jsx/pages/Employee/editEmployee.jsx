import React, { useEffect, useState } from "react";
import { DatePicker } from "rsuite";
import Select from "react-select";

import PageTitle from "../../layouts/PageTitle";
import { getRolesApi } from "../../../services/apis/RolesApi";
import {
  EditEmployeeApi,
  getEmployeeById,
} from "../../../services/apis/EmployeeApi";
import uplodIcon from "../../../assets/images/upload-icon.png";
import { Toaster } from "../../components/Toaster/Toster";
import { ToastContainer } from "react-toastify";
import Loader from "../../components/Loader/Loader";
import { useParams } from "react-router-dom";
import apis from "../../../services/apis";

const EditEmployee = () => {
  const params = useParams();
  const [logo, setLogo] = useState(null);
  const [selectedRoleOption, setSelectedRoleOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState();


  // const [zones, setZones] = useState();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    image: "",
  });
  let errorsObj = {
    email: "",
    password: "",
    phone: "",
    firstName: "",
    lastName: "",
    personalEmail: "",
  };

  const [errors, setErrors] = useState(errorsObj);
  const fetchEmployee = async () => {
    try {
      setLoading(true); // Show loader before request
      const res = await getEmployeeById(params.id);
  console.log(res?.data.success);
  
      if (res?.data.success) {
        // Set role in dropdown
        setSelectedRoleOption({
          value: res.User.role_id?._id,
          label: res.User.role_id?.name,
        });
  
        // Set form data
        setFormData({
          email: res?.User?.email,
          phone: res?.User?.phone,
          firstName: res?.User?.firstName,
          lastName: res?.User?.lastName,
          role: {
            value: res.User.role_id?._id,
            label: res.User.role_id?.name,
          },
          image: res?.User?.image,
        });
  
        // Set image preview
        setLogo({ url: res?.User?.image });
  
        Toaster.success(res.data.message); // ✅ Success toast
      } else {
        Toaster.error(res.data.message); // ❌ Fail but no exception
      }
    } catch (error) {
      Toaster.error(error.response.data.message);
    } finally {
      setLoading(false); // Hide loader
    }
  };
  
  console.log(formData, "---------------formData---------------");
  useEffect(() => {
    fetchEmployee();
  }, []);

  // Handle the logo image change
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
    setFormData((prev) => ({ ...prev, image: file }));
  };

  // Validation logic for multiple fields
  const validateFields = () => {
    const errorObj = {
      email: "",
      phone: "",
      firstName: "",
      lastName: "",
      personalEmail: "",
    };
    let isError = false;

    // Email validation
    if (!formData.email) {
      errorObj.email = "Email is required";
      isError = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errorObj.email = "Invalid email format";
      isError = true;
    }

    // Phone validation
    if (!formData.phone) {
      errorObj.phone = "Phone number is required";
      isError = true;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errorObj.phone = "Phone number must be 10 digits";
      isError = true;
    }

    // Firstname validation
    if (!formData.firstName) {
      errorObj.firstName = "First name is required";
      isError = true;
    }

    // Lastname validation
    if (!formData.lastName) {
      errorObj.lastName = "Last name is required";
      isError = true;
    }
    if (!selectedRoleOption?.value || !formData.role) {
      errorObj.role = "Role is required";
      isError = true;
    }

    setErrors(errorObj); // Set the validation errors
    return isError; // Return if there's any error
  };

  // const handleInputChange = (e) => {
  //     const { name, value } = e.target;
  //     setFormData((prevState) => ({
  //         ...prevState,
  //         [name]: value,
  //     }));
  // };

  const handleInputChange = (e, field) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Reset specific field error when the user starts typing
    if (field === "email") {
      // Custom validation for email field
      if (errors.email) {
        setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
      }
    } else if (field === "phone") {
      // Custom validation for phone field
      if (errors.phone) {
        setErrors((prevErrors) => ({ ...prevErrors, phone: "" }));
      }
    } else if (field === "firstName") {
      // Custom validation for firstname field
      if (errors.firstName) {
        setErrors((prevErrors) => ({ ...prevErrors, firstName: "" }));
      }
    } else if (field === "lastname") {
      // Custom validation for lastname field
      if (errors.lastName) {
        setErrors((prevErrors) => ({ ...prevErrors, lastName: "" }));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      personalEmail: "",
      email: "",
    });
    setSelectedRoleOption(null);
    setLogo(null);
    setErrors({});
    setLoading(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateFields()) {
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Example usage:
    const email = formData.email;

    if (!emailRegex.test(email)) {
      Toaster.error("Invalid email format");
      return;
    }

    const employeeData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      role_id: selectedRoleOption?.value,
      image: formData.image,
    };

    try {
      setLoading(true);
      const res = await EditEmployeeApi(params.id, employeeData);

      if (res.success) {
        Toaster.success(res.message);
        resetForm();
      } else {
        console.log(
          res.message.toString(),
          "---------------res---------------"
        );
        Toaster.error(res.message.toString());
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Project creation failed. Please try again.";

      Toaster.error(errorMessage);
    }
    setLoading(false);

    // Add your form submission logic here, e.g., making an API call with employeeData.
    console.log("Form Submitted:", employeeData);
  };

  const handleDeleteLogo = () => {
    setLogo(null);
    document.getElementById("logoUpload").value = ""; // Reset file input
    setFormData((prev) => ({ ...prev, image: null }));
  };

  const fetchRoles = async () => {
    try {
      const res = await getRolesApi();
      // Mapping roles data for dropdown format
      const dropdownRoles = res.data?.roles.map((role) => ({
        value: role._id,
        label: role.name,
      }));
      // Now set the dropdown formatted data
      setRoles(dropdownRoles);
    } catch (error) {
      //error goes here
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Inline styles
  const styles = {
    container: {
      border: "2px dashed #ccc",
      borderRadius: "8px",
      width: "150px", // Logo size
      height: "150px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      backgroundColor: "#f9f9f9",
      position: "relative",
      textAlign: "center",
      overflow: "hidden",
    },
    coverContainer: {
      border: "2px dashed #ccc",
      borderRadius: "8px",
      width: "300px", // Cover size (2:1 ratio)
      height: "150px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      backgroundColor: "#f9f9f9",
      position: "relative",
      textAlign: "center",
      overflow: "hidden",
    },
    placeholder: {
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      textAlign: "center",
    },
    img: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "8px",
    },
    hover: {
      borderColor: "#007bff",
      backgroundColor: "#e9f4ff",
    },
    uploadIcon: {
      color: "#888",
      fontSize: "16px",
      fontWeight: "bold",
    },
    deleteIcon: {
      position: "absolute",
      top: "0px",
      right: "0px",
      backgroundColor: "#FF6D6D",
      color: "white",
      borderRadius: "100%",
      padding: "5px 10px",
      cursor: "pointer",
      zIndex: 2,
      fontSize: "10px",
      fontWeight: "bold",
    },
  };
  return (
    <>
      <PageTitle activeMenu={"Update Employee Data"} motherMenu={"Employees"} />
      <ToastContainer />
      <Loader visible={loading} />

      <div className="row">
        {/* SECTION 1st Genaral Information */}
        <div className="col-xl-12 col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Genaral Information</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-12 col-md-8  row">
                  <div className="col-sm-6">
                    <label className="col-form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ex: John"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                    {errors.firstName && (
                      <div className="text-danger fs-12">
                        {errors.firstName}
                      </div>
                    )}
                  </div>

                  <div className="col-sm-6 mt-2 mt-sm-0">
                    <label className="col-form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Ex: Doe"
                    />
                    {errors.lastName && (
                      <div className="text-danger fs-12">{errors.lastName}</div>
                    )}
                  </div>

                  <div className="col-sm-6 mt-2 mt-sm-0">
                    <label className="col-form-label">Phone</label>
                    <input
                      type="number"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Validate only numbers and enforce maxLength of 10 digits
                        if (/^\d*$/.test(value) && value.length <= 10) {
                          handleInputChange(e);
                        }
                      }}
                      placeholder="Ex: +9XXX-XXX-XXXX"
                      maxLength={10}
                    />
                    {errors.phone && (
                      <div className="text-danger fs-12">{errors.phone}</div>
                    )}
                  </div>


                  <div className="col-sm-6">
                    <label className="col-form-label">Role</label>
                    <Select
                      defaultValue={selectedRoleOption}
                      onChange={setSelectedRoleOption}
                      options={roles}
                      style={{
                        lineHeight: "40px",
                        color: "#7e7e7e",
                        paddingLeft: " 15px",
                      }}
                      value={formData.role}
                    />
                    {errors.role && (
                      <div className="text-danger fs-12">{errors.role}</div>
                    )}
                  </div>

                </div>

                <div className="col-sm-6 col-md-4 flex justify-center items-center">
                  <div
                    className="col-sm-12"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <label className="col-form-label">Employee Image</label>
                    <div style={styles.container}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        style={{ display: "none" }}
                        id="logoUpload"
                      />
                      {logo ? (
                        <>
                          {/* Simple 'X' button as the delete icon */}
                          <div
                            style={styles.deleteIcon}
                            onClick={handleDeleteLogo}
                          >
                            ⛌
                          </div>
                          <img
                            src={
                              logo.url
                                ? apis.baseurl.Baseimageurl + formData.image
                                : logo
                            }
                            alt="Logo"
                            style={styles.img}
                          />
                        </>
                      ) : (
                        <label htmlFor="logoUpload" style={styles.placeholder}>
                          <div
                            style={styles.uploadIcon}
                            className="flex flex-col cursor-pointer"
                          >
                            <img
                              width="30"
                              src={uplodIcon}
                              alt="Upload Icon"
                            ></img>
                            <p>Upload Image</p>
                          </div>
                        </label>
                      )}
                    </div>
                    <p className="mt-2">
                      Image format - jpg png jpeg gif
                      <br />
                      Image Size - maximum size 2 MB
                      <br />
                      Image Ratio - 1:1
                    </p>
                    {errors.logo && (
                      <div className="text-danger fs-12">{errors.logo}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2nd Account Info*/}
        <div className="col-xl-12 col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Account Info</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-4">
                  <label className="col-form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Ex: John@company.com"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && (
                    <div className="text-danger fs-12">{errors.email}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Loader visible={loading} />
        {/* Section Submit button */}
        <div className="text-end">
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn btn-primary rounded-sm"
          >
            Save Information
          </button>
        </div>
      </div>
    </>
  );
};

export default EditEmployee;
