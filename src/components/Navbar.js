import React from "react";
import {
  Navbar,
  Nav,
  Container,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "../index.css";

function CustomNavbar() {
  return (
    <Navbar expand="lg" className="bg-light flex-column">
      <Container className="justify-content-center">
        {/* Centered Logo */}
        <Navbar.Brand
          href="/"
          className="fs-2 fw-bold text-primary text-center"
        >
          HoliDaze
        </Navbar.Brand>
      </Container>

      {/* Navigation Links */}
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

      {/* Search and Login/Register */}
      <Container className="justify-content-end">
        <Nav className="ml-auto d-flex align-items-center">
          <Form className="d-flex me-3">
            <FormControl
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
          </Form>
          <Nav.Link as={Link} to="/login" className="text-primary">
            Login / Register
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
