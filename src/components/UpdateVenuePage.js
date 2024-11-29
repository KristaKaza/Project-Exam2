import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

function UpdateVenuePage() {
  const [venueName, setVenueName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { id } = useParams(); // Get venue ID from URL
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.accessToken;

  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        const response = await fetch(`REACT_APP_API_BASE_URL/venues/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          setError("Failed to load venue details.");
          return;
        }

        setVenueName(data.name);
        setLocation(data.location);
        setDescription(data.description);
      } catch (error) {
        setError("Something went wrong. Please try again.");
      }
    };

    fetchVenueDetails();
  }, [id, token]);

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
        `https://v2.api.noroff.dev/holidaze/venues/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.errors?.[0]?.message || "Failed to update venue.");
        return;
      }

      setSuccess("Venue updated successfully!");
      setTimeout(() => navigate(`/venue/${id}`), 2000); // Redirect to the venue details page
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Container className="mt-5">
      <h2>Update Venue</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        {/* Similar form fields for venue */}
        {/* Submit button */}
      </Form>
    </Container>
  );
}

export default UpdateVenuePage;
