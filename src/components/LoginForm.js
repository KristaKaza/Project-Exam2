import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      email: email.trim(),
      password: password,
    };

    try {
      const response = await fetch("https://v2.api.noroff.dev/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login error details:", errorData);
        setError(
          errorData.errors?.[0]?.message || "Invalid email or password."
        );
        return;
      }

      const data = await response.json();
      console.log("Login successful:", data);

      // Check the structure of the returned data
      console.log("User data:", data.data);

      localStorage.setItem(
        "user",
        JSON.stringify({
          email: data.data.email,
          name: data.data.name,
          accessToken: data.data.accessToken, // This should be saved here
        })
      );

      // Debug navigate
      console.log("Navigating to profile:", `/profile/${data.data.name}`);
      navigate(`/profile/${data.data.name}`);
    } catch (error) {
      console.error("Error during login:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Login</h2>

      {/* Display error message if any */}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        {/* Email input */}
        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        {/* Password input */}
        <Form.Group controlId="password" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        {/* Submit button */}
        <Button variant="primary" type="submit" className="mt-3 w-100">
          Login
        </Button>
      </Form>
    </Container>
  );
}

export default LoginForm;
