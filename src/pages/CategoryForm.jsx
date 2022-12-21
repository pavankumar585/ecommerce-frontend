import { useState, useEffect } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Row, Col, Form, Button, Container } from "react-bootstrap";
import Input from "../common/Input";
import { useDispatch, useSelector } from "react-redux";
import { addCategory, updateCategory } from "../store/categories";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./CategoryForm.css";

const schema = yup.object().shape({
  name: yup.string().required().min(3).max(50),
});

function CategoryForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: categoryId } = useParams();
  const [error, setError] = useState("");
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const { loading, list, isSuccess } = useSelector(
    (state) => state.entities.categories
  );
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
    if (isSuccess) navigate("/admin/categories");
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (categoryId === "new-category") return;

    const category = list.find((c) => c._id === categoryId);
    if (!category) return navigate("/admin/categories");
    reset(mapToViewModel(category));
    setPreviewImage(category.image.url);
  }, [categoryId, list, navigate, reset]);

  const mapToViewModel = (category) => {
    return {
      _id: category._id,
      name: category.name,
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

    if (categoryId === "new-category")
      return dispatch(addCategory({ ...data, image }));

    dispatch(updateCategory({ ...data, image }));
  };

  return (
    <Container className="mt-3">
      <Row>
        <Col>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <h3 className="mb-3">Save Category</h3>
            <Input
              register={register}
              label="Name"
              name="name"
              placeholder="Enter category name"
              error={errors.name?.message}
            />
            <Input
              label="Image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <Button size="sm" className="mt-3" type="submit" disabled={loading}>
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

export default CategoryForm;
