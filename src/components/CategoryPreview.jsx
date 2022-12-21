import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./CategoryPreview.css";

function CategoryPreview({ category }) {
  return (
    <Col
      lg={4}
      sm={6}
      as={Link}
      key={category._id}
      to={`/products/category/${
        category.name[0].toLowerCase() + category.name.slice(1)
      }`}
      className="text-decoration-none"
    >
      <div
        className="category"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), 
          rgba(0, 0, 0, 0.5)), url(${category.image.url})`,
        }}
      >
        {category.name}
      </div>
    </Col>
  );
}

export default CategoryPreview;
