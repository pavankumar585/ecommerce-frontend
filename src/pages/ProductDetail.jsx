import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loadProduct } from "../store/products";
import { addToCart } from "../store/cart";
import ProductPreview from "../components/ProductPreview";
import Loading from "../common/Loading";
import {
  Row,
  Col,
  Badge,
  ButtonGroup,
  Form,
  Button,
  Container,
} from "react-bootstrap";
import "./ProductDetail.css";

function ProductDetail() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { id: productId } = useParams();
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const { loading: disabled } = useSelector((state) => state.entities.cart);
  const { product, similarProducts, loading, error } = useSelector(
    (state) => state.entities.products
  );

  useEffect(() => {
    dispatch(loadProduct(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (error) return navigate("/not-found");
  }, [error, navigate]);

  const handleAddToCart = () => {
    if (!currentUser) return navigate("/login", { state: pathname });

    dispatch(addToCart(productId, qty));
  };

  if (loading) return <Loading />;

  return (
    <Container>
      <Row>
        <Col lg={6} className="mt-4">
          <img
            src={product?.image.url}
            alt={product?.name}
            className="product-img"
          />
        </Col>
        <Col lg={6} className="mt-4">
          <h1>{product?.name}</h1>
          <p>
            <Badge bg={product?.stock > 0 ? "primary" : "danger"}>
              {product?.stock > 0 ? "In Stock" : "Out Of Stock"}
            </Badge>
          </p>
          <p>&#8377; {product?.price}</p>
          <p style={{ textAlign: "justify" }}>
            <strong>Description: </strong>
            {product?.description}
          </p>
          <ButtonGroup style={{ width: "100%" }}>
            <Form.Select
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              style={{ width: "50%", borderRadius: "0" }}
              disabled={disabled}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </Form.Select>
            <Button size="lg" onClick={handleAddToCart} disabled={disabled}>
              {currentUser ? "Add to Cart" : "Login to Add"}
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
      <div className="my-5">
        {similarProducts.length > 0 && (
          <>
            <h1>Similar Products</h1>
            <div className="d-flex justify-content-center flex-wrap">
              {similarProducts.map((product) => (
                <ProductPreview key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </Container>
  );
}

export default ProductDetail;
