import { useState, useEffect } from "react";
import { Container, Badge, Button, Modal } from "react-bootstrap";
import { loadMyOrders } from "../store/orders";
import { useDispatch, useSelector } from "react-redux";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import Loading from "../common/Loading";
import moment from "moment";
import "./MyOrders.css";

function MyOrders() {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const { items, loading } = useSelector((state) => state.entities.orders);

  useEffect(() => {
    dispatch(loadMyOrders());
  }, [dispatch]);

  const handleClose = () => setShow(false);

  const handleShow = (order) => {
    setShow(true);
    setOrderDetails(order);
  };

  return (
    <Container>
      {loading ? (
        <Loading />
      ) : (
        <>
          {items.length === 0 ? (
            <div className="text-center">
              <h1 className="border-bottom pb-3">No orders yet</h1>
              <Link to="/" className="text-decoration-none text-muted">
                <FaLongArrowAltLeft /> Start Shopping
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-center border-bottom pb-2">My Orders</h1>
              {items?.map((item) => (
                <div key={item._id} className="order border-bottom pt-3">
                  <div style={{ width: "220px" }}>
                    <h6>Order Id:</h6>
                    <p>{item._id}</p>
                  </div>
                  <div style={{ width: "50px" }}>
                    <h6>Items:</h6>
                    <p>{item.totalQty}</p>
                  </div>
                  <div style={{ width: "80px" }}>
                    <h6>Total:</h6>
                    <p>&#8377;{item.totalPrice}</p>
                  </div>
                  <div style={{ width: "110px" }}>
                    <h6>Order Date:</h6>
                    <p>{moment(item.date).format("MMM Do YYYY")}</p>
                  </div>
                  <div style={{ width: "80px" }}>
                    <h6>Status:</h6>
                    <p>
                      {item.status === "processing" ? (
                        <Badge bg="warning">{item.status}</Badge>
                      ) : (
                        <Badge bg="success">{item.status}</Badge>
                      )}
                    </p>
                  </div>
                  <Button size="sm mb-3" onClick={() => handleShow(item)}>
                    View
                  </Button>
                </div>
              ))}
            </>
          )}

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Order Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {orderDetails?.orderItems.map((p) => (
                <div key={p._id} className="order gap-3 border-bottom py-3">
                  <Link to={`/products/${p._id}`}>
                    <img src={p.image} alt={p.name} width="200" height="200" />
                  </Link>
                  <div className="order-details">
                    <p>
                      <span className="h6">Id: </span>
                      {p._id}
                    </p>
                    <p>
                      <span className="h6">Name: </span>
                      {p.name}
                    </p>
                    <p>
                      <span className="h6">Price: </span>
                      &#8377;{p.price}
                    </p>
                    <p>
                      <span className="h6">Qty: </span>
                      {p.qty}
                    </p>
                    <p>
                      <span className="h6">Total: </span>
                      &#8377;{p.total}
                    </p>
                  </div>
                </div>
              ))}
              <div>
                <h4 className="mt-3">Shipping Adress</h4>
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
        </>
      )}
    </Container>
  );
}

export default MyOrders;
