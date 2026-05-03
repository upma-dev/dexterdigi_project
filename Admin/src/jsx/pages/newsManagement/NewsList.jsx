import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Switch from "react-switch";
import { Modal, Dropdown } from "react-bootstrap";
import { Button, Row, Col } from "reactstrap";

import PageTitle from "../../layouts/PageTitle";
import Loader from "../../components/Loader/Loader";
import { ToastContainer } from "react-toastify";
import { Toaster } from "../../components/Toaster/Toster";
import apis from "../../../services/apis";

import {
  changeNewsStatusApi,
  deleteNewsApi,
  getAllNewsApi,
} from "../../../services/newsApi";

const NewsList = () => {
  // eslint-disable-next-line no-unused-vars
  const [news, setNews] = useState([]);
  const [sortedNews, setSortedNews] = useState([]); // <-- For sorting on current page
  const [sortAsc, setSortAsc] = useState(true); // toggle arrow state

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [modalCentered, setModalCentered] = useState(false);

  const navigate = useNavigate();

  // Delay search input
  useEffect(() => {
    const handler = setTimeout(() => setSearchValue(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch News
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await getAllNewsApi({
          page,
          limit,
          search: searchValue,
        });

        const payload = response?.data?.data;
        const list = payload?.items || [];
        setNews(list);
        setSortedNews(list); // default sorted list
        setTotalPages(payload?.totalPages || 1);
      } catch (error) {
        const msg =
          error?.response?.data?.message || "Failed to fetch news list.";
        Toaster.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [page, limit, searchValue]);

  // SORT BY S.NO (index sorting only on current page)
  const handleSort = () => {
    const sorted = [...sortedNews];
    if (sortAsc) {
      sorted.reverse();
    } else {
      sorted.reverse();
    }
    setSortedNews(sorted);
    setSortAsc(!sortAsc);
  };

  // Toggle Status
  const handleStatusToggle = async (item) => {
    const updatedStatus = item.status === "published" ? "draft" : "published";
    try {
      await changeNewsStatusApi(item._id, updatedStatus);
      setNews((prev) =>
        prev.map((n) =>
          n._id === item._id ? { ...n, status: updatedStatus } : n
        )
      );
      setSortedNews((prev) =>
        prev.map((n) =>
          n._id === item._id ? { ...n, status: updatedStatus } : n
        )
      );
      Toaster.success("Status updated");
    } catch {
      Toaster.error("Failed to update");
    }
  };

  // Delete
  const handleDeleteRequest = (item) => {
    setSelectedNews(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedNews?._id) return;
    setLoading(true);
    try {
      await deleteNewsApi(selectedNews._id);
      setNews((prev) => prev.filter((i) => i._id !== selectedNews._id));
      setSortedNews((prev) => prev.filter((i) => i._id !== selectedNews._id));
      Toaster.success("News deleted");
    } catch {
      Toaster.error("Failed to delete news");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleLimitChange = (value) => {
    setLimit(Number(value));
    setPage(1);
  };

  const pages = Array.from(
    { length: Math.max(1, totalPages) },
    (_, i) => i + 1
  );

  const startIndex = (page - 1) * limit + 1;

  const renderImage = (item) => {
    const image = item.cover_image || item.image;
    if (!image) return <span className="text-muted">No image</span>;
    return (
      <img
        src={`${apis.baseurl.newsImageBase}${image}`}
        alt="news"
        className="rounded"
        style={{ width: 60, height: 40, objectFit: "cover" }}
      />
    );
  };

  return (
    <>
      <ToastContainer />
      <Loader visible={loading} />
      <PageTitle motherMenu="News" activeMenu="News List" />

      <Row>
        <Col lg={12}>
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="card-title">News</h4>

              <div className="d-flex gap-2 align-items-center">
                <Button color="primary" onClick={() => navigate("/add-news")}>
                  Add News
                </Button>
              </div>
            </div>

            <div className="card-body">
              <div id="holidayList" className="dataTables_wrapper no-footer">
                {/* TOP FILTER BAR (same as employee) */}
                <div className="justify-content-between d-sm-flex mb-3">
                  {/* Show Entries */}
                  <div className="dataTables_length">
                    <label className="d-flex align-items-center">
                      Show
                      <Dropdown className="search-drop ms-2">
                        <Dropdown.Toggle as="div" className="search-drop-btn">
                          {limit}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {[5, 10, 15, 20].map((v) => (
                            <Dropdown.Item
                              key={v}
                              onClick={() => handleLimitChange(v)}
                            >
                              {v}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                      <span className="ms-2">entries</span>
                    </label>
                  </div>

                  {/* Search Input */}
                  <div className="dataTables_filter">
                    <label>
                      Search:{" "}
                      <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => {
                          setPage(1);
                          setSearchTerm(e.target.value);
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* TABLE */}
                <div className="table-responsive">
                  <table className="display dataTable no-footer w-100">
                    <thead>
                      <tr>
                        <th onClick={handleSort} style={{ cursor: "pointer" }}>
                          S.No.
                          <span>
                            {sortAsc ? (
                              <i className="fa fa-arrow-up ms-2 fs-12" />
                            ) : (
                              <i className="fa fa-arrow-down ms-2 fs-12" />
                            )}
                          </span>
                        </th>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Author</th>
                        <th>Publish Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {sortedNews.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-4">
                            No news found
                          </td>
                        </tr>
                      ) : (
                        sortedNews.map((item, idx) => (
                          <tr key={item._id}>
                            <td>
                              <strong>{startIndex + idx}</strong>
                            </td>
                            <td>{renderImage(item)}</td>
                            <td>{item.title}</td>
                            <td>{item.category || "-"}</td>
                            <td>{item.author?.name || "-"}</td>
                            <td>
                              {item.publish_date
                                ? new Date(
                                    item.publish_date
                                  ).toLocaleDateString()
                                : "-"}
                            </td>

                            <td>
                              <div className="d-flex gap-2 align-items-center">
                                <div className="d-flex align-items-center gap-2 me-2">
                                  <Switch
                                    onChange={() => handleStatusToggle(item)}
                                    checked={item.status === "published"}
                                    onColor="#3b7ddd"
                                    uncheckedIcon={false}
                                    checkedIcon={false}
                                  />
                                  <small>
                                    {item.status === "published"
                                      ? "Published"
                                      : "Draft"}
                                  </small>
                                </div>
                                <button
                                  className="btn btn-xs sharp btn-primary"
                                  onClick={() =>
                                    navigate(`/edit-news/${item._id}`)
                                  }
                                >
                                  <i className="fa fa-pencil" />
                                </button>
                                <button
                                  className="btn btn-xs sharp btn-danger"
                                  onClick={() => handleDeleteRequest(item)}
                                >
                                  <i className="fa fa-trash" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION (same UI as employee list) */}
                <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
                  <div className="dataTables_info">
                    Showing {sortedNews.length ? startIndex : 0} to{" "}
                    {sortedNews.length ? startIndex + sortedNews.length - 1 : 0}{" "}
                    entries
                  </div>

                  <div className="dataTables_paginate paging_simple_numbers">
                    <Link
                      className="paginate_button previous"
                      to="#"
                      onClick={() => page > 1 && setPage(page - 1)}
                    >
                      Previous
                    </Link>

                    <span>
                      {pages.map((p) => (
                        <Link
                          key={p}
                          to="#"
                          className={`paginate_button ${
                            p === page ? "current" : ""
                          }`}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </Link>
                      ))}
                    </span>

                    <Link
                      className="paginate_button next"
                      to="#"
                      onClick={() => page < pages.length && setPage(page + 1)}
                    >
                      Next
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* DELETE MODAL */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete News</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>{selectedNews?.title || "this item"}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button color="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NewsList;
