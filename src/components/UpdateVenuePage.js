// src/pages/UpdateVenuePage.js

import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

function UpdateVenuePage() {
  const [venueName, setVenueName] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.accessToken;

  // Check if the user is the venue manager
  const [venueOwner, setVenueOwner] = useState(false);

  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (response.ok && data) {
          setVenueName(data.name || "");
          setDescription(data.description || "");
          setMediaUrl(data.media?.[0]?.url || "");

          // Check if the logged-in user is the owner of the venue
          if (data._owner && data._owner.username === user.name) {
            setVenueOwner(true);
          } else {
            setError("You are not authorized to edit this venue.");
          }
        } else {
          setError("Failed to fetch venue details.");
        }
      } catch (error) {
        console.error("Error fetching venue details:", error);
        setError("Failed to fetch venue details.");
      }
    };

    fetchVenueDetails();
  }, [id, token, user.name]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!venueName || !description || !mediaUrl) {
      setError("All fields are required.");
      return;
    }

    const updatedData = {
      name: venueName,
      description,
      media: [{ url: mediaUrl }],
    };

    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/holidaze/venues/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        setError("Error updating venue.");
        return;
      }

      setSuccess("Venue updated successfully!");
      setTimeout(() => navigate(`/profile/${user.name}`), 2000);
    } catch (error) {
      console.error("Error updating venue:", error);
      setError("Failed to update venue.");
    }
  };

  if (!venueOwner) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          You are not authorized to edit this venue.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2>Update Venue</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formVenueName" className="mb-3">
          <Form.Label>Venue Name</Form.Label>
          <Form.Control
            type="text"
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formDescription" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formMediaUrl" className="mb-3">
          <Form.Label>Media URL</Form.Label>
          <Form.Control
            type="url"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Update Venue
        </Button>
      </Form>
    </Container>
  );
}

export default UpdateVenuePage;
