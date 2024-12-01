import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function LoginForm({ setIsAuthenticated }) {
  // Get the function as a prop
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    setError(""); // Reset previous errors

    try {
      // Make a POST request to the login API
      const response = await fetch("https://v2.api.noroff.dev/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login error response:", errorData);
        setError(errorData.errors?.[0]?.message || "Login failed");
        return;
      }

      // Parse the response data
      const responseData = await response.json();
      console.log("Login response data:", responseData);

      const { accessToken, name } = responseData.data;

      // Check if accessToken and name are present in the response
      if (!accessToken || !name) {
        setError("Invalid response from server");
        return;
      }

      // Save the token and user data to localStorage for session persistence
      localStorage.setItem("authToken", accessToken);
      localStorage.setItem("user", JSON.stringify({ name, email }));

      // Update the authentication state in App.js
      setIsAuthenticated(true);

      // Redirect to the user profile page
      console.log("Redirecting to profile with name:", name);
      navigate(`/profile/${name}`);
    } catch (error) {
      // Handle any unexpected errors
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <Container>
      <h2>Login</h2>
      {/* Show error alert if an error occurs */}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="password" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </Container>
  );
}

export default LoginForm;
