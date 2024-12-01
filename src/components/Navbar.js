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
  const user = JSON.parse(localStorage.getItem("user"));

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
          <Nav.Link as={Link} to="/create-venue" className="mx-3">
            Create Venue
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
            <>
              {/* Link to Profile page */}
              <Nav.Link
                as={Link}
                to={`/profile/${user?.name}`}
                className="text-primary mx-2"
              >
                Profile
              </Nav.Link>
              <Nav.Link onClick={onLogout} className="text-primary mx-2">
                Logout
              </Nav.Link>
            </>
          ) : (
            <>
              {/* Show Login and Register links when not authenticated */}
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
