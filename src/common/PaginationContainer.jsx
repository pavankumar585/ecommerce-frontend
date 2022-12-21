import { InputGroup, Form } from "react-bootstrap";

function PaginationContainer({
  itemsCount,
  pagesize,
  currentPage,
  onNextPage,
  onPrevPage,
  onFirstPage,
  onLastPage,
}) {
  const pageCount = Math.ceil(itemsCount / pagesize);

  return (
    <InputGroup className="mb-3">
      <InputGroup.Text
        onClick={onFirstPage}
        className={currentPage === 1 ? "ms-2 disabled" : "ms-2 clickable"}
      >
        &laquo;
      </InputGroup.Text>
      <InputGroup.Text
        onClick={onPrevPage}
        className={currentPage === 1 ? "ms-2 disabled" : "ms-2 clickable"}
      >
        &lsaquo;
      </InputGroup.Text>
      <Form.Control className="ms-2" value={currentPage} readOnly />
      <InputGroup.Text className="me-2">/ {pageCount}</InputGroup.Text>
      <InputGroup.Text
        className={
          currentPage >= pageCount ? "me-2 disabled" : "me-2 clickable"
        }
        onClick={onNextPage}
      >
        &rsaquo;
      </InputGroup.Text>
      <InputGroup.Text
        onClick={() => onLastPage(pageCount)}
        className={
          currentPage >= pageCount ? "me-2 disabled" : "me-2 clickable"
        }
      >
        &raquo;
      </InputGroup.Text>
    </InputGroup>
  );
}

export default PaginationContainer;
