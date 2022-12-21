import { useEffect } from "react";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import { loadCategories } from "../store/categories";
import { useDispatch, useSelector } from "react-redux";
import { loadFewProducts } from "../store/products";
import ProductPreview from "../components/ProductPreview";
import CategoryPreview from "../components/CategoryPreview";
import Footer from "../components/Footer";
import Loading from "../common/Loading";
import "./Home.css";

function Home() {
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.entities.categories);
  const { list: products, loading } = useSelector(
    (state) => state.entities.products
  );

  useEffect(() => {
    dispatch(loadFewProducts());
    dispatch(loadCategories());
  }, [dispatch]);

  if (loading) return <Loading />;

  return (
    <>
      <Container>
        <div className="home-container">
          <div className="mb-5 logo-banner">
            <img
              src="https://res.cloudinary.com/dyljqyfcp/image/upload/v1671281302/banners/kiygrsqg9igw8c3wyfaa.jpg"
              alt="ecommerce-banner"
            />
          </div>
          <div>
            <p className="h2">Latest products</p>
            <div className="d-flex justify-content-center flex-wrap">
              {products.map((product) => (
                <ProductPreview key={product._id} product={product} />
              ))}
            </div>
            <Link
              className="d-block mb-5 text-decoration-none text-end"
              to="/products/category/all"
            >
              See more {">>"}
            </Link>
          </div>
          <div className="mb-5 offer-banner">
            <Link to="/products/category/all">
              <img
                src="https://res.cloudinary.com/dyljqyfcp/image/upload/v1671293701/banners/nnxt7mzgiispiqdypuka.jpg"
                alt="sales-banner"
              />
            </Link>
          </div>
          <Row className="mb-5">
            {list.map((category) => (
              <CategoryPreview key={category._id} category={category} />
            ))}
          </Row>
        </div>
      </Container>
      <Footer />
    </>
  );
}

export default Home;
