import React, { useState } from "react";
import {
  Nav,
  Navbar,
  Container,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function CustomNavbar({ isAuthenticated, onLogout }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${query.trim()}`);
    }
  };

  return (
    <Navbar expand="lg" className="bg-light flex-column">
      <Container className="justify-content-center">
        <Navbar.Brand
          as={Link}
          to="/"
          className="fs-2 fw-bold text-primary text-center"
        >
          HoliDaze
        </Navbar.Brand>
      </Container>

      <Container className="justify-content-center">
        <Nav className="text-center">
          <Nav.Link as={Link} to="/" className="mx-3">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/about" className="mx-3">
            About
          </Nav.Link>
          <Nav.Link as={Link} to="/create-booking" className="mx-3">
            Create a Booking
          </Nav.Link>
        </Nav>
      </Container>

      <Container className="justify-content-end">
        <Nav className="ml-auto d-flex align-items-center">
          {/* Search Bar */}
          <Form className="d-flex me-3" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Search venues"
              className="me-2"
              aria-label="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button type="submit" variant="outline-primary">
              Search
            </Button>
          </Form>

          {/* Auth Links */}
          {isAuthenticated ? (
            <Nav.Link onClick={onLogout} className="text-primary">
              Logout
            </Nav.Link>
          ) : (
            <>
              <Nav.Link as={Link} to="/login" className="text-primary mx-2">
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/register" className="text-primary mx-2">
                Register
              </Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
