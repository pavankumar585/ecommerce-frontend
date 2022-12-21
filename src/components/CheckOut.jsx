import Button from "react-bootstrap/Button";
import axios from "axios";
import { useState } from "react";
import "./CheckOut.css";

function CheckOutButton({ onDisabled }) {
  const [disabled, setDisabled] = useState(false);

  const handleCheckout = async () => {
    setDisabled(true);
    onDisabled(true);

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/checkout/create-checkout-session`
      );

      window.location.href = data.url;
    } catch (error) {
      setDisabled(false);
      onDisabled(false);
    }
  };

  return (
    <Button
      size="sm"
      className="check-out-btn"
      onClick={handleCheckout}
      disabled={disabled}
    >
      Check Out
    </Button>
  );
}

export default CheckOutButton;
