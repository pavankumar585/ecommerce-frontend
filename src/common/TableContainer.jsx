import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import Table from "react-bootstrap/Table";

function TableContainer({ items, columns, sortColumn, onSort }) {
  return (
    <Table striped bordered hover responsive>
      <TableHeader columns={columns} sortColumn={sortColumn} onSort={onSort} />
      <TableBody columns={columns} items={items} />
    </Table>
  );
}
export default TableContainer;
