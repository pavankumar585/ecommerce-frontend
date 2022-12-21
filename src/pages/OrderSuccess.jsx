import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
import "./OrderSuccess.css";

function OrderSuccess() {
  return (
    <Container>
      <div
        style={{ height: "90vh" }}
        className="d-flex justify-content-center align-items-center flex-column"
      >
        <p className="order-header">Your order was Successfull🎉</p>
        <p className="text-center">
          We received your order and will process it within the next 24 hours!
        </p>
        <Link to="/" className="text-decoration-none text-muted">
          <FaLongArrowAltLeft /> Continue Shopping
        </Link>
      </div>
    </Container>
  );
}

export default OrderSuccess;
