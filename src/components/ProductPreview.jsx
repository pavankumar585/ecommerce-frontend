import { Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./ProductPreview.css";

function ProductPreview({ product }) {
  return (
    <Card as={Link} to={`/products/${product._id}`} className="product-card">
      <Card.Img
        variant="top"
        src={product.image.url}
        className="product-card-img"
      />
      <Card.Body>
        <Card.Title className="h6" style={{ color: "black" }}>
          {product.name}
        </Card.Title>
        <Badge bg={product.stock > 0 ? "primary" : "danger"}>
          {product.stock > 0 ? "In Stock" : "Out Of Stock"}
        </Badge>
      </Card.Body>
    </Card>
  );
}

export default ProductPreview;
