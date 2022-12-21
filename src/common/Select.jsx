import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

function Select({
  label,
  name,
  register = () => {},
  items = [],
  propId = "_id",
  propName = "name",
  error,
  varient = "danger",
  ...rest
}) {
  return (
    <>
      <Form.Label>{label}</Form.Label>
      <Form.Select
        aria-label="Default select example"
        {...rest}
        {...register(name)}
        className="mb-3"
      >
        <option value="" className="text-muted">
          Select an option
        </option>
        {items.map((item) => (
          <option key={item[propId]} value={item[propId]}>
            {item[propName]}
          </option>
        ))}
      </Form.Select>
      {error && (
        <Alert className="p-2" style={{ marginTop: "-16px" }} variant={varient}>
          {error}
        </Alert>
      )}
    </>
  );
}

export default Select;
