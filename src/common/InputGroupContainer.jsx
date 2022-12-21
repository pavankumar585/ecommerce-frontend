import { Form, InputGroup } from "react-bootstrap";

function InputLabel({ label, align = "left", ...rest }) {
  return (
    <InputGroup className="mb-3">
      {align === "left" && <InputGroup.Text>{label}</InputGroup.Text>}
      <Form.Control {...rest} />
      {align === "right" && <InputGroup.Text>{label}</InputGroup.Text>}
    </InputGroup>
  );
}

export default InputLabel;
