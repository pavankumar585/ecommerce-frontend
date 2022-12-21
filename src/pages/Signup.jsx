import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../store/auth";
import Input from "../common/Input";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import "./Signup.css";

const schema = yup.object().shape({
  email: yup.string().required().email().min(11).max(50),
  password: yup.string().required().min(5).max(50),
  name: yup.string().required().min(3).max(50),
  conformPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("password")], "passwords do not match."),
});

function Signup() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const { loading, currentUser } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const body = { ...data };
    delete body.conformPassword;

    await dispatch(signupUser(body));
    navigate(state ? state : "/");
  };

  if (currentUser) return <Navigate to="/" />;

  return (
    <div className="d-flex align-items-center justify-content-center signup">
      <Form onSubmit={handleSubmit(onSubmit)} className="form">
        <h1 className="mb-3 text-center">Create your acount</h1>
        <div className="signup-form">
          <Input
            label="Email"
            name="email"
            placeholder="Enter email"
            register={register}
            error={errors.email?.message}
          />
          <Input
            label="Name"
            name="name"
            placeholder="Enter name"
            register={register}
            error={errors.name?.message}
          />
          <Input
            label="Password"
            name="password"
            type={isVisible ? "text" : "password"}
            placeholder="Enter password"
            register={register}
            symbol={isVisible ? <VscEyeClosed /> : <VscEye />}
            onClick={() => setIsVisible(!isVisible)}
            error={errors.password?.message}
          />
          <Input
            label="Conform Password"
            name="conformPassword"
            type={isConfirm ? "text" : "password"}
            placeholder="Re-enter your password"
            register={register}
            symbol={isConfirm ? <VscEyeClosed /> : <VscEye />}
            onClick={() => setIsConfirm(!isConfirm)}
            error={errors.conformPassword?.message}
          />
          <Button disabled={loading} size="sm" type="submit" className="mb-2">
            Create account
          </Button>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </Form>
    </div>
  );
}

export default Signup;
