import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Input from "../common/Input";
import ProductPreview from "../components/ProductPreview";
import { useDispatch, useSelector } from "react-redux";
import { loadProductsByCategory } from "../store/products";
import Loading from "../common/Loading";
import "./Category.css";

function Category() {
  const { name } = useParams();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const { list, loading } = useSelector((state) => state.entities.products);

  useEffect(() => {
    dispatch(loadProductsByCategory(name));
  }, [dispatch, name]);

  const filtered = list.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLocaleLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <>
      <div className="category-banner">
        <h1>{name[0].toUpperCase() + name.slice(1)}</h1>
      </div>
      <Container>
        <div className="d-flex justify-content-center">
          <Input
            placeholder="Search product"
            style={{ width: "18rem" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="d-flex justify-content-center flex-wrap">
          {filtered.map((product) => (
            <ProductPreview key={product._id} product={product} />
          ))}
        </div>
      </Container>
    </>
  );
}

export default Category;
