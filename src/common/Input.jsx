import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";

function Input({
  name,
  label,
  type = "text",
  register = () => {},
  error,
  varient = "danger",
  icon,
  symbol,
  onClick,
  ...rest
}) {
  return (
    <Form.Group className="mb-3 position-relative" controlId={name}>
      <Form.Label>
        {label} {icon && <span>{icon}</span>}{" "}
        {symbol && (
          <span
            onClick={onClick}
            className="position-absolute top-50 end-0 clickable pe-3"
          >
            {symbol}
          </span>
        )}
      </Form.Label>
      <Form.Control {...rest} type={type} {...register(name)} />
      {error && (
        <Alert className="p-2" variant={varient}>
          {error}
        </Alert>
      )}
    </Form.Group>
  );
}

export default Input;
