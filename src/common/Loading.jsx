import Spinner from "react-bootstrap/Spinner";

function Loading({ animation = "border", variant = "info", ...rest }) {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "70vh" }}
    >
      <Spinner {...rest} animation={animation} variant={variant} />
      <span className="ps-2">Loading...</span>
    </div>
  );
}

export default Loading;
