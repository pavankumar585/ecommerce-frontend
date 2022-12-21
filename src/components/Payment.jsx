import axios from "axios";
import { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Form, Button } from "react-bootstrap";
import { createOrder } from "../store/orders";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Payment.css";

function Payment() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { address } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.entities.cart);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !items) return;

    setIsProcessing(true);

    const { data: clientSecret } = await axios.post(
      `${process.env.REACT_APP_API_URL}/orders/create-payment-intent`
    );

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      }
    );

    if (error) setErrorMessage(error.message);

    if (paymentIntent) {
      await dispatch(createOrder({ ...address, clientSecret }));
      navigate("/order-success/7585887");
    }

    setIsProcessing(false);
  };

  return (
    <Form onSubmit={handleSubmit} className="paymnet-form">
      <CardElement id="payment-element" />
      <Button size="sm" type="submit" disabled={isProcessing || !items}>
        {!isProcessing ? "Pay now" : "Processing..."}
      </Button>
      <p>{errorMessage && errorMessage}</p>
    </Form>
  );
}

export default Payment;
