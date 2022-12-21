import { useState, useEffect } from "react";
import { loadOrders, shipOrder } from "../store/orders";
import { Row, Col, Form, Button, Badge } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import ModalTable from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import Table from "../common/TableContainer";
import Input from "../common/Input";
import Pagination from "../common/PaginationContainer";
import { paginate, startIndex, endIndex } from "../utils/paginate";
import InputGroup from "../common/InputGroupContainer";
import Loading from "../common/Loading";
import { FaEye } from "react-icons/fa";
import moment from "moment";
import _ from "lodash";

function Orders() {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [pageSize, setPageSize] = useState(8);
  const [limit, setLimit] = useState(pageSize);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState({ path: "_id", order: "asc" });
  const { items, loading } = useSelector((state) => state.entities.orders);

  useEffect(() => {
    dispatch(loadOrders());
  }, [dispatch]);

  const columns = [
    { path: "_id", label: "Order Id" },
    { path: "user.name", label: "User Name" },
    { path: "totalQty", label: "Items" },
    {
      path: "totalPrice",
      label: "Order Total",
      content: (order) => <span>&#8377;{order.totalPrice}</span>,
    },
    {
      path: "date",
      label: "Order Date",
      content: (order) => (
        <span>{moment(order.date).format("MMM Do YYYY")}</span>
      ),
    },
    {
      key: "view",
      content: (order) => (
        <span className="clickable" onClick={() => handleShow(order)}>
          View <FaEye size="1.2em" />
        </span>
      ),
    },
    {
      key: "shipped",
      content: (order) =>
        order.status === "processing" ? (
          <Button size="sm" onClick={() => dispatch(shipOrder(order._id))}>
            Ship order
          </Button>
        ) : (
          <Badge bg="success">{order.status}</Badge>
        ),
    },
  ];

  const handleClose = () => setShow(false);

  const handleShow = (order) => {
    setShow(true);
    setOrderDetails(order);
  };

  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };

  const handleSearchQuery = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
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

  const sorted = _.orderBy(items, [sortColumn.path], [sortColumn.order]);

  const filtered = sorted.filter((order) => {
    const date = moment(order.date).format("MMM Do YYYY");

    return date.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const orders = paginate(filtered, currentPage, pageSize);

  if (loading) return <Loading />;

  return (
    <Container>
      <Input
        type="search"
        value={searchQuery}
        onChange={(e) => handleSearchQuery(e.target.value)}
        placeholder="Search by order date"
      />
      <Table
        columns={columns}
        sortColumn={sortColumn}
        onSort={handleSort}
        items={orders}
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
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ModalTable striped bordered hover responsive>
            <thead>
              <tr>
                <th>Product</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails?.orderItems.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img src={p.image} width="50" height="50" alt={p.name} />
                  </td>
                  <td>
                    <p>{p.name}</p>
                  </td>
                  <td>
                    <p>&#8377;{p.price}</p>
                  </td>
                  <td>
                    <p>{p.qty}</p>
                  </td>
                  <td>
                    <p>&#8377;{p.total}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </ModalTable>
          <div>
            <h4>Shipping Adress</h4>
            <hr />
            <address>
              {orderDetails?.shipping.email} <br />
              {orderDetails?.shipping.phone} <br />
              {orderDetails?.shipping.name} <br />
              {orderDetails?.shipping.address.line1} <br />
              {orderDetails?.shipping.address.line2}{" "}
              {orderDetails?.shipping.address.line2 && <br />}
              {orderDetails?.shipping.address.city}
              {" - "}
              {orderDetails?.shipping.address.postal_code} <br />
              {orderDetails?.shipping.address.state} <br />
              {orderDetails?.shipping.address.country}
            </address>
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

export default Orders;
