import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Navbar, Nav, Button, Badge } from "react-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/auth";
import { loadCart, resetCart } from "../store/cart";
import { IoMdCart } from "react-icons/io";
import "./Navigation.css";

function Navigation() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.entities.cart);

  useEffect(() => {
    if (currentUser) dispatch(loadCart());
  }, [currentUser, dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(resetCart());
  };

  return (
    <Navbar sticky="top" bg="light" variant="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          E-commerce
        </Navbar.Brand>
        {currentUser && (
          <Link
            to="/shopping-cart"
            className="nav-cart-info me-auto cart-color"
          >
            <IoMdCart size="1.5rem" />
            <Badge pill bg="warning" text="dark">
              {items?.totalQty}
            </Badge>
          </Link>
        )}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!currentUser && (
              <>
                <Nav.Link as={Link} to="/login">
                  Log in
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  Sign up
                </Nav.Link>
              </>
            )}
            {currentUser && (
              <NavDropdown title={currentUser.name} id="basic-nav-dropdown">
                <>
                  <NavDropdown.Item as={Link} to="/my-profile">
                    My Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/my-orders">
                    My Orders
                  </NavDropdown.Item>
                </>
                {currentUser.isAdmin && (
                  <>
                    <NavDropdown.Item as={Link} to="/admin/products">
                      Manage Products
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/categories">
                      Manage Categories
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/users">
                      Manage Users
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/orders">
                      Manage Orders
                    </NavDropdown.Item>
                  </>
                )}
                <NavDropdown.Divider />
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleLogout}
                  style={{ marginLeft: "16px" }}
                  as={Link}
                  to={"/"}
                >
                  Logout
                </Button>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
