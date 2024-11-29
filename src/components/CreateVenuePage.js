import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function CreateVenuePage() {
  const [venueName, setVenueName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Get user data from localStorage to get the accessToken
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.accessToken;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!venueName || !location || !description) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setSuccess("");

    const requestBody = {
      name: venueName.trim(),
      location: location.trim(),
      description: description.trim(),
    };

    try {
      const response = await fetch(
        "https://v2.api.noroff.dev/holidaze/venues",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.errors?.[0]?.message || "Failed to create venue.");
        return;
      }

      setSuccess("Venue created successfully!");
      setTimeout(() => navigate("/profile/" + user.name), 2000);
    } catch (error) {
      console.error("Error creating venue:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Container className="mt-5">
      <h2>Create Venue</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formVenueName" className="mb-3">
          <Form.Label>Venue Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter venue name"
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formLocation" className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formDescription" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Enter venue description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Create Venue
        </Button>
      </Form>
    </Container>
  );
}

export default CreateVenuePage;
