import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/auth";
import { loadCart } from "../store/cart";
import Input from "../common/Input";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import "./Signup.css";

const schema = yup.object().shape({
  email: yup.string().required().email().min(11).max(50),
  password: yup.string().required().min(5).max(50),
});

function Login() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const { loading, currentUser } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    await dispatch(loginUser(data));
    await dispatch(loadCart());
    navigate(state ? state : "/");
  };

  if (currentUser) return <Navigate to="/" />;

  return (
    <div className="d-flex align-items-center justify-content-center signup">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="mb-3 text-center">Login to your account</h1>
        <div className="signup-form">
          <Input
            register={register}
            label="Email"
            name="email"
            placeholder="Enter email"
            error={errors.email?.message}
          />
          <Input
            register={register}
            label="Password"
            name="password"
            type={isVisible ? "text" : "password"}
            placeholder="Enter password"
            symbol={isVisible ? <VscEyeClosed /> : <VscEye />}
            onClick={() => setIsVisible(!isVisible)}
            error={errors.password?.message}
          />
          <Button disabled={loading} size="sm" type="submit" className="mb-2">
            Login
          </Button>
          <p>
            Dont't have an account?{" "}
            <Link state={state} to="/signup">
              Create account
            </Link>{" "}
          </p>
        </div>
      </Form>
    </div>
  );
}

export default Login;
