import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Row, Col, Form, Button, Container } from "react-bootstrap";
import { loadCategories } from "../store/categories";
import { addProduct, updateProduct } from "../store/products";
import Input from "../common/Input";
import Select from "../common/Select";
import { toast } from "react-toastify";
import { BiRupee } from "react-icons/bi";
import "./CategoryForm.css";

const schema = yup.object().shape({
  name: yup.string().required().min(3).max(255),
  description: yup.string().required().min(50).max(1024),
  price: yup
    .number()
    .required()
    .typeError("price must be a number")
    .min(0)
    .max(10_00_000),
  stock: yup
    .number()
    .required()
    .typeError("stock must be a number")
    .min(0)
    .max(1_00_000),
  categoryId: yup.string().required(),
});

function ProductForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const [error, setError] = useState("");
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const { list } = useSelector((state) => state.entities.categories);
  const {
    loading,
    list: products,
    isSuccess,
  } = useSelector((state) => state.entities.products);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (error) toast.warn(error);
    setError("");
  }, [error]);

  useEffect(() => {
    dispatch(loadCategories());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) navigate("/admin/products");
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (productId === "new-product") return;

    const product = products.find((p) => p._id === productId);
    if (!product) return navigate("/admin/products");
    reset(mapToViewModel(product));
    setPreviewImage(product.image.url);
  }, [productId, products, navigate, reset]);

  const mapToViewModel = (product) => {
    return {
      _id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.category._id,
    };
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    transformFile(file);
  };

  const transformFile = (file) => {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImage(reader.result);
        setPreviewImage(reader.result);
      };
    } else {
      setImage("");
      setPreviewImage("");
    }
  };

  const onSubmit = (data) => {
    if (previewImage === "") return setError("Please select an image.");

    if (productId === "new-product")
      return dispatch(addProduct({ ...data, image }));

    dispatch(updateProduct({ ...data, image }));
  };

  return (
    <Container className="mt-3">
      <Row>
        <Col>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <h3 className="mb-3">Save Product</h3>
            <Input
              register={register}
              label="Name"
              name="name"
              placeholder="Enter product name"
              error={errors.name?.message}
            />
            <Input
              style={{ height: 80 }}
              register={register}
              as="textarea"
              label="Description"
              name="description"
              placeholder="Enter product description"
              error={errors.description?.message}
            />
            <Input
              register={register}
              label="Price"
              name="price"
              type="number"
              placeholder="Enter product price"
              error={errors.price?.message}
              icon={<BiRupee size={"1.2em"} />}
            />
            <Input
              register={register}
              label="Stock"
              name="stock"
              type="number"
              placeholder="Enter number in stock"
              error={errors.stock?.message}
            />
            <Select
              register={register}
              items={list}
              label="Category"
              name="categoryId"
              error={errors.categoryId?.message}
            />
            <Input
              label="Image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <Button size="sm" type="submit" className="mb-2" disabled={loading}>
              {!loading ? "Save" : "Saving..."}
            </Button>
          </Form>
        </Col>
        <Col className="image-preview-container">
          {previewImage ? (
            <img src={previewImage} alt="category" />
          ) : (
            <p>Image preview will appear here!</p>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ProductForm;
