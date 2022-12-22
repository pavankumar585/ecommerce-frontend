import { useState } from "react";
import { Container, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  AiFillPlusCircle,
  AiFillMinusCircle,
  AiFillDelete,
} from "react-icons/ai";
import {
  increaseCart,
  decreaseCart,
  removeFromCart,
  clearCart,
} from "../store/cart";
import CheckOut from "../components/CheckOut";
import "./ShoppingCart.css";

function Cart() {
  const [disabled, setDisabled] = useState(false);
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.entities.cart);

  const handleDisabled = (value) => {
    setDisabled(value);
  };

  return (
    <Container>
      <p className="h3 text-center border-bottom py-2">Schopping Cart</p>
      {!items ? (
        <div className="text-center">
          <p className="h6">Shopping cart is empty</p>
          <Link to="/" className="text-decoration-none text-muted">
            <FaLongArrowAltLeft /> Start Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-4">
          <p>You have {items?.totalQty} items in your shopping cart.</p>
          {items?.products.map((p) => (
            <div key={p._id} className="cart-item border-bottom mt-4">
              <div>
                <img src={p.image} alt={p.name} />
                <p className="mt-2 cart-item-price">&#8377;{p.price}</p>
              </div>
              <div className="cart-item-wrapper">
                <p className="h6 text-muted">{p.name}</p>
                <ul className="cart-item-quantity mt-2">
                  <li
                    className={
                      p.qty === 1 || disabled ? "disable-btn" : "clickable"
                    }
                  >
                    <AiFillMinusCircle
                      onClick={() => dispatch(decreaseCart(p._id))}
                    />
                  </li>
                  <li>{p.qty}</li>
                  <li
                    className={
                      p.qty === 99 || disabled ? "disable-btn" : "clickable"
                    }
                  >
                    <AiFillPlusCircle
                      onClick={() => dispatch(increaseCart(p._id))}
                    />
                  </li>
                </ul>
              </div>
              <div>
                <p className="h6">Total</p>
                <p className="mt-2 cart-item-price">&#8377; {p.total} </p>
              </div>
              <AiFillDelete
                className={loading || disabled ? "disable-btn" : "clickable"}
                onClick={() => dispatch(removeFromCart(p._id))}
              />
            </div>
          ))}
          {items && (
            <div className="d-flex justify-content-between align-items-start mt-3">
              <Button
                size="sm"
                variant="danger"
                disabled={loading || disabled}
                onClick={() => dispatch(clearCart())}
              >
                Clear Cart
              </Button>
              <div className="total-qty">
                <div className="h4 total-price">
                  <span>Subtotal</span>
                  <span className="ms-3">&#8377; {items.totalPrice}</span>
                </div>
                <CheckOut onDisabled={handleDisabled} />
                <Link
                  to="/products/category/all"
                  className="text-decoration-none text-muted mt-2 continue-shop"
                >
                  <FaLongArrowAltLeft /> Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </Container>
  );
}

export default Cart;
