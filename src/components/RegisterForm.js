import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const [name, setName] = useState(""); // Add name field
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Customer"); // Default role is Customer
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (!name || !email || !password || !confirmPassword || !role) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!email.endsWith("@stud.noroff.no")) {
      setError("Email must be a valid stud.noroff.no address.");
      return;
    }

    setError("");
    setSuccess("");

    const requestBody = {
      name: name.trim(), // Add name to the request body
      email: email.trim(),
      password: password,
      role: role.toLowerCase(), // Adjust case if needed
    };

    try {
      const response = await fetch("https://v2.api.noroff.dev/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Registration error details:", errorData); // Log detailed error
        throw new Error(
          errorData.errors?.[0]?.message || "Registration failed"
        );
      }

      const data = await response.json();
      console.log("Registration successful:", data);

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <Container className="mt-5">
      <h2>Register</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        {/* Name Input */}
        <Form.Group controlId="formName" className="mb-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        {/* Email Input */}
        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        {/* Password Input */}
        <Form.Group controlId="formPassword" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        {/* Confirm Password Input */}
        <Form.Group controlId="formConfirmPassword" className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        {/* Role Selection */}
        <Form.Group controlId="formRole" className="mb-3">
          <Form.Label>Role</Form.Label>
          <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Customer">Customer</option>
            <option value="Venue Manager">Venue Manager</option>
          </Form.Select>
        </Form.Group>

        {/* Submit Button */}
        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
    </Container>
  );
}

export default RegisterForm;
