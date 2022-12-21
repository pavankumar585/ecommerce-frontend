import _ from "lodash";
import Input from "../common/Input";
import { Link } from "react-router-dom";
import Table from "../common/TableContainer";
import { useEffect, useState } from "react";
import { Button, Row, Col, Form, Container } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { loadProducts, deleteProduct } from "../store/products";
import { loadCategories } from "../store/categories";
import Pagination from "../common/PaginationContainer";
import { paginate, startIndex, endIndex } from "../utils/paginate";
import InputGroup from "../common/InputGroupContainer";
import ListGroup from "../common/ListGroupContainer";
import Loading from "../common/Loading";
import { FaEye } from "react-icons/fa";
import moment from "moment";

function ProductsTable() {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [currentCategory, setCurrentCategory] = useState({ _id: "" });
  const [categories, setCategories] = useState([]);
  const [pageSize, setPageSize] = useState(8);
  const [limit, setLimit] = useState(pageSize);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState({ path: "_id", order: "asc" });
  const { list, loading } = useSelector((state) => state.entities.products);
  const { list: items } = useSelector((state) => state.entities.categories);
  const { currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadCategories());
    dispatch(loadProducts());
  }, [dispatch]);

  useEffect(() => {
    const categories = [{ _id: "", name: "All Categories" }, ...items];
    setCategories(categories);
  }, [items]);

  const columns = [
    {
      path: "_id",
      label: "Product Id",
      content: (product) => (
        <Link style={{ textDecoration: "none" }} to={`${product._id}`}>
          {product._id}
        </Link>
      ),
    },
    { path: "name", label: "Product Name" },
    { path: "category.name", label: "Product Category" },
    {
      path: "price",
      label: "Product Price",
      content: (product) => <span>&#8377;{product.price}</span>,
    },
    { path: "stock", label: "Stock" },
    {
      key: "view",
      content: (product) => (
        <span className="clickable" onClick={() => handleShow(product)}>
          View <FaEye size="1.2em" />
        </span>
      ),
    },
  ];

  if (currentUser && currentUser.isSuperAdmin)
    columns.push({
      key: "delete",
      content: (product) => (
        <Button
          size="sm"
          variant="danger"
          onClick={() => handleDelete(product)}
          disabled={loading}
        >
          Delete
        </Button>
      ),
    });

  const handleClose = () => setShow(false);

  const handleShow = (product) => {
    setShow(true);
    setProductDetails(product);
  };

  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };

  const handleCurrentCategory = (category) => {
    setCurrentCategory(category);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleSearchQuery = (query) => {
    setSearchQuery(query);
    setCurrentCategory({ _id: "" });
    setCurrentPage(1);
  };

  const handleDelete = (product) => {
    dispatch(deleteProduct(product));
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

  const caseInsensitive = (product) => {
    if (sortColumn.path === undefined) return null;

    if (sortColumn.path === "price" || sortColumn.path === "stock")
      return product[sortColumn.path];

    return _.get(product, sortColumn.path).toLowerCase();
  };

  const sorted = _.orderBy(list, [caseInsensitive], [sortColumn.order]);

  let filtered = sorted;
  if (searchQuery) {
    filtered = sorted.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  } else if (currentCategory._id) {
    filtered = sorted.filter((p) => p.category.name === currentCategory.name);
  }

  const products = paginate(filtered, currentPage, pageSize);

  if (loading) return <Loading />;

  return (
    <Container>
      <Row>
        <Col xs={2} className="mt-3">
          <ListGroup
            items={categories}
            currentItem={currentCategory}
            onCurrentItemChange={handleCurrentCategory}
          />
        </Col>
        <Col>
          <Button size="sm" className="mt-3" as={Link} to="new-product">
            Add Product
          </Button>
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => handleSearchQuery(e.target.value)}
            placeholder="Search by product name"
          />
          <Table
            columns={columns}
            items={products}
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
        </Col>
      </Row>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex gap-3">
            <img
              src={productDetails?.image.url}
              alt={productDetails?.name}
              width="200"
            />
            <div>
              <p>
                <span className="h6">Id: </span>
                {productDetails?._id}
              </p>
              <p>
                <span className="h6">Name: </span>
                {productDetails?.name}
              </p>
              <p>
                <span className="h6">Price: </span>
                &#8377;{productDetails?.price}
              </p>
              <p>
                <span className="h6">Stock: </span>
                {productDetails?.stock}
              </p>
              <p>
                <span className="h6">Created At: </span>
                {moment(productDetails?.createdAt).format("MMM Do YYYY")}
              </p>
              <p>
                <span className="h6">Updated At: </span>
                {moment(productDetails?.updatedAt).format("MMM Do YYYY")}
              </p>
            </div>
          </div>
          <p className="mt-3">
            <span className="h6">Description: </span>
            {productDetails?.description}
          </p>
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

export default ProductsTable;
