import Table from "../common/TableContainer";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Form, Container, Button, Badge } from "react-bootstrap";
import { useEffect, useState } from "react";
import Input from "../common/Input";
import Pagination from "../common/PaginationContainer";
import { paginate, startIndex, endIndex } from "../utils/paginate";
import InputGroup from "../common/InputGroupContainer";
import Loading from "../common/Loading";
import _ from "lodash";
import {
  loadUsers,
  markUserAsAdmin,
  revokeUserAsAdmin,
  deleteUser,
} from "../store/users";

function Users() {
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(8);
  const [limit, setLimit] = useState(pageSize);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState({ path: "_id", order: "asc" });
  const { list, loading } = useSelector((state) => state.entities.users);
  const { currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUsers());
  }, [dispatch]);

  const columns = [
    { path: "_id", label: "User Id" },
    { path: "name", label: "User Name" },
    { path: "email", label: "User Email" },
    {
      path: "isAdmin",
      label: "User Roles",
      content: (user) => (
        <>
          {user.isAdmin ? <Badge bg="info">Admin</Badge> : <Badge>User</Badge>}
        </>
      ),
    },
  ];

  if (currentUser && currentUser.isSuperAdmin)
    columns.push(
      {
        key: "admin",
        content: (user) => (
          <>
            {user.isAdmin ? (
              <Button
                size="sm"
                variant="warning"
                onClick={() => dispatch(revokeUserAsAdmin(user._id))}
              >
                Revoke admin
              </Button>
            ) : (
              <Button
                size="sm"
                variant="success"
                onClick={() => dispatch(markUserAsAdmin(user._id))}
              >
                Make admin
              </Button>
            )}
          </>
        ),
      },
      {
        key: "delete",
        content: (user) => (
          <Button
            size="sm"
            variant="danger"
            onClick={() => dispatch(deleteUser(user._id))}
          >
            Delete
          </Button>
        ),
      }
    );

  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };

  const handleSearchQuery = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = (lastPage) => {
    setCurrentPage(lastPage);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isNaN(limit) || limit === "") setPageSize(pageSize);
    else setPageSize(limit);

    setCurrentPage(1);
  };

  const sorted = _.orderBy(list, [sortColumn.path], [sortColumn.order]);

  const filtered = sorted.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const users = paginate(filtered, currentPage, pageSize);

  if (loading) return <Loading />;

  return (
    <Container>
      <Input
        type="search"
        value={searchQuery}
        onChange={(e) => handleSearchQuery(e.target.value)}
        placeholder="Search by user name"
      />
      <Table
        columns={columns}
        items={users}
        sortColumn={sortColumn}
        onSort={handleSort}
      />
      <Row>
        <Col xs={6}>
          <p>
            Results: {startIndex(currentPage, pageSize, filtered)} -{" "}
            {endIndex(currentPage, pageSize, filtered)} / {filtered.length}
          </p>
        </Col>
        <Col xs={2}>
          <Form onSubmit={handleSubmit}>
            <InputGroup
              label="Limit:"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />
          </Form>
        </Col>
        <Col xs={4}>
          <Pagination
            itemsCount={filtered.length}
            pagesize={pageSize}
            currentPage={currentPage}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            onFirstPage={handleFirstPage}
            onLastPage={handleLastPage}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Users;
