import _ from "lodash";
import { Link } from "react-router-dom";
import { Button, Row, Col, Form, Container } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../common/PaginationContainer";
import { loadCategories, deleteCategory } from "../store/categories";
import Input from "../common/Input";
import Table from "../common/TableContainer";
import { paginate, startIndex, endIndex } from "../utils/paginate";
import InputGroup from "../common/InputGroupContainer";
import Loading from "../common/Loading";
import { FaEye } from "react-icons/fa";
import moment from "moment";

function CategoriesTable() {
  const [show, setShow] = useState(false);
  const [categoryDetails, setCategoryDetails] = useState(null);
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(8);
  const [limit, setLimit] = useState(pageSize);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState({ path: "_id", order: "asc" });
  const { list, loading } = useSelector((state) => state.entities.categories);
  const { currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadCategories());
  }, [dispatch]);

  const columns = [
    {
      path: "_id",
      label: "Category Id",
      content: (category) => (
        <Link style={{ textDecoration: "none" }} to={`${category._id}`}>
          {category._id}
        </Link>
      ),
    },
    { path: "name", label: "Category Name" },
    {
      kay: "view",
      content: (category) => (
        <span className="clickable" onClick={() => handleShow(category)}>
          View <FaEye size="1.2em" />
        </span>
      ),
    },
  ];

  if (currentUser && currentUser.isSuperAdmin)
    columns.push({
      key: "delete",
      content: (category) => (
        <Button
          size="sm"
          variant="danger"
          onClick={() => handleDelete(category)}
          disabled={loading}
        >
          Delete
        </Button>
      ),
    });

  const handleClose = () => setShow(false);

  const handleShow = (category) => {
    setShow(true);
    setCategoryDetails(category);
  };

  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };

  const handleSearchQuery = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleDelete = (category) => {
    dispatch(deleteCategory(category));
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = (lastPage) => {
    setCurrentPage(lastPage);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isNaN(limit) || limit === "") setPageSize(pageSize);
    else setPageSize(limit);

    setCurrentPage(1);
  };

  const sorted = _.orderBy(list, [sortColumn.path], [sortColumn.order]);

  const filtered = sorted.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = paginate(filtered, currentPage, pageSize);

  if (loading) return <Loading />;

  return (
    <Container>
      <Button size="sm" className="mt-3" as={Link} to="new-category">
        Add Category
      </Button>
      <Input
        type="search"
        value={searchQuery}
        onChange={(e) => handleSearchQuery(e.target.value)}
        placeholder="Search by category name"
      />
      <Table
        columns={columns}
        items={categories}
        sortColumn={sortColumn}
        onSort={handleSort}
      />
      <Row>
        <Col xs={6}>
          <p>
            Results: {startIndex(currentPage, pageSize, filtered)} -{" "}
            {endIndex(currentPage, pageSize, filtered)} / {filtered.length}
          </p>
        </Col>
        <Col xs={2}>
          <Form onSubmit={handleSubmit}>
            <InputGroup
              label="Limit:"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />
          </Form>
        </Col>
        <Col xs={4}>
          <Pagination
            itemsCount={filtered.length}
            pagesize={pageSize}
            currentPage={currentPage}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            onFirstPage={handleFirstPage}
            onLastPage={handleLastPage}
          />
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Category Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex gap-3">
            <img
              src={categoryDetails?.image.url}
              alt={categoryDetails?.name}
              width="200"
              height="200"
              style={{ objectFit: "cover" }}
            />
            <div>
              <p>
                <span className="h6">Id: </span>
                {categoryDetails?._id}
              </p>
              <p>
                <span className="h6">Name: </span>
                {categoryDetails?.name}
              </p>
              <p>
                <span className="h6">Created At: </span>
                {moment(categoryDetails?.createdAt).format("MMM Do YYYY")}
              </p>
              <p>
                <span className="h6">Updated At: </span>
                {moment(categoryDetails?.updatedAt).format("MMM Do YYYY")}
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default CategoriesTable;
