import React, { useState, useRef, useEffect } from "react";
// import { Row, Col, Dropdown, Button, Modal, Container, Card } from 'react-bootstrap';

import { Dropdown, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Row,
  Col,
} from "reactstrap";

import PageTitle from "../../layouts/PageTitle";
import {
  deleteEmployeesApi,
  getEmployeesApi,
} from "../../../services/apis/EmployeeApi";
import Loader from "../../components/Loader/Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "../../components/Toaster/Toster";
import useDebounce from "../../components/common/Debounce";
import DeleteWarningMdl from "../../components/common/DeleteWarningMdl";

const holidayTable = [
  {
    id: 1,
    sno: "01",
    employeeName: "John Doe",
    phone: "+91-8000-234-234",
    email: "john@example.com",
    createdAt: "01/10/2024",
  },
];

const theadData = [
  { heading: "S.No.", sortingVale: "sno" },
  { heading: "Employee Name", sortingVale: "employeeName" },
  { heading: "Employee Role", sortingVale: "role" },
  { heading: "Phone", sortingVale: "phone" },
  { heading: "Email", sortingVale: "email" },
  { heading: "Created At", sortingVale: "createdAt" },
  { heading: "Action", sortingVale: "action" },
];


const EmployeeList = () => {
  const [sort, setSortata] = useState(10);
  const [UpdateCategory, setUpdateCategory] = useState(false);
  const [modalCentered, setModalCentered] = useState(false);
  const [logo, setLogo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [showDeleteMdl, setShowDeleteMdl] = useState(false);
  const [deleteTableDataId, setDeleteTableDataId] = useState("");
  const [feeData, setFeeDate] = useState([...holidayTable]);
  const [iconData, setIconDate] = useState({ complete: false, ind: Number });

  const navigate = useNavigate();
  const [data, setData] = useState(
    document.querySelectorAll("#holidayList tbody tr")
  );
  const debouncedSearchValue = useDebounce(searchInputValue, 500);
  const activePag = useRef(0);
  const [test, settest] = useState(0);
  const [employeeData, setEmployeeData] = useState();

  const chageData = (frist, sec) => {
    for (var i = 0; i < data.length; ++i) {
      if (i >= frist && i < sec) {
        data[i].classList.remove("d-none");
      } else {
        data[i].classList.add("d-none");
      }
    }
  };

  useEffect(() => {
    setData(document.querySelectorAll("#holidayList tbody tr"));
  }, [test]);

  const fetchEmployees = async (sortValue) => {
    setLoading(true);
    try {
      const res = await getEmployeesApi(
        currentPage,
        sort,
        sortValue,
        searchInputValue
      );
      setEmployeeData(res.data?.admins);
      // setUpdateRoles(false)
      setUpdateCategory(false);
    } catch (error) {
      Toaster.error("Failed to load Employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  console.log(employeeData);
  
  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };
  const handleDeleteEmployee = (id) => {
    setDeleteTableDataId(id);
    setShowDeleteMdl(true);
  };
  const handleDeleteSubmit = async () => {
    try {
      const res = await deleteEmployeesApi(deleteTableDataId);
      //   console.log("response",res);
      if (res.success) {
        setUpdateCategory(true);
        Toaster.success(res?.message); // Display success message
        fetchEmployees();
        // setDeleteTableDataId("");
        setShowDeleteMdl(false);
      } else {
        Toaster.error(
          res?.data?.message || "Something went wrong. Please try again."
        );
      }
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        "Project Deletation failed. Please try again.";

      Toaster.error(errorMessage);
    }
  };

  const handleStatusChange = async (ProductId) => {
    try {
      const res = await {};
      //  UpdateProjectStatus(ProductId);
      console.log(res, "---------------res---------------");
      if (res.success) {
        Toaster.success(res?.message); // Display success message
        fetchEmployees();
      } else {
        Toaster.error(
          res?.message || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "Project Deletation failed. Please try again.";

      Toaster.error(errorMessage);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  activePag.current === 0 && chageData(0, sort);

  let paggination = Array(Math.ceil(data.length / sort))
    .fill()
    .map((_, i) => i + 1);

  const onClick = (i) => {
    activePag.current = i;
    chageData(activePag.current * sort, (activePag.current + 1) * sort);
    settest(i);
  };


  function SotingData(name) {
    const sortedPeople = [...feeData];
    switch (name) {
      case "sno":
        sortedPeople.sort((a, b) => {
          return a.sno < b.sno ? -1 : 1;
        });
        break;
      case "title":
        sortedPeople.sort((a, b) => {
          return iconData.complete
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        });
        break;
      case "subject":
        sortedPeople.sort((a, b) => {
          return iconData.complete
            ? a.subject.localeCompare(b.subject)
            : b.subject.localeCompare(a.subject);
        });
        break;
      case "department":
        sortedPeople.sort((a, b) => {
          return iconData.complete
            ? a.department.localeCompare(b.department)
            : b.department.localeCompare(a.department);
        });
        break;
      case "type":
        sortedPeople.sort((a, b) => {
          return iconData.complete
            ? a.type.localeCompare(b.type)
            : b.type.localeCompare(a.type);
        });
        break;
      case "cap":
        sortedPeople.sort((a, b) => {
          return iconData.complete
            ? a.cap.localeCompare(b.cap)
            : b.cap.localeCompare(a.cap);
        });
        break;
      case "status":
        sortedPeople.sort((a, b) => {
          return iconData.complete
            ? a.status.localeCompare(b.status)
            : b.status.localeCompare(a.status);
        });
        break;
      default:
        break;
    }
    setFeeDate(sortedPeople);
  }


  useEffect(() => {
    fetchEmployees();
  }, [UpdateCategory, currentPage, sort, debouncedSearchValue]);



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
  };

  return (
    <>
      <DeleteWarningMdl
        title={"table data"}
        showDeleteMdl={showDeleteMdl}
        setShowDeleteMdl={setShowDeleteMdl}
        setDeleteTableDataId={setDeleteTableDataId}
        handleDeleteSubmit={handleDeleteSubmit}
      />
      <ToastContainer />
      <Loader visible={loading} />
      <PageTitle activeMenu={"Employee List"} motherMenu={"Employees"} />
      <Row>
        <Col lg={12}>
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Employee List</h4>
              {/* <Link to={"/add-staff"} className="btn btn-primary">+ Add New</Link> */}
              <Button
                variant="primary"
                type="button"
                className="mb-2 me-2"
                onClick={() => setModalCentered(true)}
              >
                Export
              </Button>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <div id="holidayList" className="dataTables_wrapper no-footer">
                  <div className="justify-content-between d-sm-flex">
                    <div className="dataTables_length">
                      <label className="d-flex align-items-center">
                        Show
                        <Dropdown className="search-drop">
                          <Dropdown.Toggle as="div" className="search-drop-btn">
                            {sort}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setSortata("2")}>
                              2
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => setSortata("5")}>
                              5
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => setSortata("10")}>
                              10
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => setSortata("15")}>
                              15
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => setSortata("20")}>
                              20
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                        entries
                      </label>
                    </div>
                    <div className="dataTables_filter">
                      <label>
                        Search :{" "}
                        <input
                          type="search"
                          className=""
                          placeholder=""
                          onChange={(e) => setSearchInputValue(e.target.value)}
                        />
                      </label>
                    </div>
                  </div>
                  <table
                    id="example4"
                    className="display dataTable no-footer w-100"
                  >
                    <thead>
                      <tr>
                        {theadData.map((item, ind) => (
                          <th
                            key={ind}
                            onClick={() => {
                              SotingData(item.sortingVale);
                              setIconDate((prevState) => ({
                                complete: !prevState.complete,
                                ind: ind,
                              }));
                            }}
                          >
                            {item.heading}
                            <span>
                              {ind !== iconData.ind && (
                                <i
                                  className="fa fa-sort ms-2 fs-12"
                                  style={{ opacity: "0.3" }}
                                />
                              )}
                              {ind === iconData.ind &&
                                (iconData.complete ? (
                                  <i
                                    className="fa fa-arrow-down ms-2 fs-12"
                                    style={{ opacity: "0.7" }}
                                  />
                                ) : (
                                  <i
                                    className="fa fa-arrow-up ms-2 fs-12"
                                    style={{ opacity: "0.7" }}
                                  />
                                ))}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {employeeData?.map((data, ind) => (
                        <tr key={ind}>
                          <td>
                            <strong>{ind + 1}</strong>{" "}
                          </td>
                          <td>{`${data?.firstName} ${data?.lastName}`}</td>
                          <td>{data?.role_id?.name}</td>
                          <td>{data?.phone}</td>
                          <td>{data?.email}</td>
                          <td>
                            {new Date(data.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true, // to show AM/PM format
                              }
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-xs sharp btn-primary me-1"
                              onClick={() =>
                                navigate(`/edit-employee/${data?._id}`)
                              }
                            >
                              <i className="fa fa-pencil" />
                            </button>

                            <button
                              className="btn btn-xs sharp btn-danger"
                              onClick={() => handleDeleteEmployee(data?._id)}
                            >
                              <i className="fa fa-trash" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
                    <div className="dataTables_info">
                      Showing {activePag.current * sort + 1} to{" "}
                      {data.length > (activePag.current + 1) * sort
                        ? (activePag.current + 1) * sort
                        : data.length}{" "}
                      of {data.length} entries
                    </div>
                    <div
                      className="dataTables_paginate paging_simple_numbers"
                      id="example5_paginate"
                    >
                      <Link
                        className="paginate_button previous disabled"
                        to={"#"}
                        onClick={() =>
                          activePag.current > 0 &&
                          onClick(activePag.current - 1)
                        }
                      >
                        Previous
                      </Link>
                      <span>
                        {paggination.map((number, i) => (
                          <Link
                            key={i}
                            to={"#"}
                            className={`paginate_button  ${
                              activePag.current === i ? "current" : ""
                            } `}
                            onClick={() => onClick(i)}
                          >
                            {number}
                          </Link>
                        ))}
                      </span>
                      <Link
                        className="paginate_button next"
                        to={"#"}
                        onClick={() =>
                          activePag.current + 1 < paggination.length &&
                          onClick(activePag.current + 1)
                        }
                      >
                        Next
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Modal --> */}
          <Modal
            className="fade"
            show={modalCentered}
            onHide={setModalCentered}
            centered
          >
            <Modal.Header>
              <Modal.Title>+ Add new cuisine</Modal.Title>
              <Button
                onClick={() => setModalCentered(false)}
                variant=""
                className="btn-close"
              ></Button>
            </Modal.Header>
            <Modal.Body>
              <div className="col-xl-12 col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div>
                      <div className="mb-3 row">
                        <div className="col-sm-12">
                          <label className="col-sm-3 col-form-label">
                            Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="New cuisine"
                          />
                        </div>
                      </div>
                      <div className="mb-3 row">
                        <div className="col-sm-12">
                          <label className="col-form-label">
                            Cuisine image
                          </label>
                          <div style={styles.container}>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoChange}
                              style={{ display: "none" }}
                              id="logoUpload"
                            />
                            <label
                              htmlFor="logoUpload"
                              style={styles.placeholder}
                            >
                              {logo ? (
                                <img src={logo} alt="Logo" style={styles.img} />
                              ) : (
                                <div style={styles.uploadIcon}>
                                  Upload Image
                                </div>
                              )}
                            </label>
                          </div>
                          <p>
                            Image format - jpg png jpeg gif
                            <br />
                            Image Size - maximum size 2 MB
                            <br />
                            Image Ratio - 1:1
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                onClick={() => setModalCentered(false)}
                variant="danger light"
              >
                Close
              </Button>
              <Button variant="primary">Save changes</Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </>
  );
};

export default EmployeeList;
