// src/pages/DeleteVenuePage.js

import React, { useState } from "react";
import { Button, Alert, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

function DeleteVenuePage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.accessToken;

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/holidaze/venues/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        setError("Failed to delete venue.");
        return;
      }

      setSuccess("Venue deleted successfully!");
      setTimeout(() => navigate(`/profile/${user.name}`), 2000);
    } catch (error) {
      console.error("Error deleting venue:", error);
      setError("Failed to delete venue.");
    }
  };

  return (
    <Container className="mt-5">
      <h2>Delete Venue</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Button variant="danger" onClick={handleDelete}>
        Delete Venue
      </Button>
    </Container>
  );
}

export default DeleteVenuePage;
